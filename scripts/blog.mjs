import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const projectRoot = process.env.BLOG_PROJECT_ROOT
  ? path.resolve(process.env.BLOG_PROJECT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsRoot = path.join(projectRoot, "content", "blog", "posts");
const generatedFile = path.join(projectRoot, "content", "blog.generated.json");
const generatedAssetsRoot = path.join(projectRoot, "public", "blog-assets");
const assetExtensions = new Set([
  ".avif",
  ".csv",
  ".doc",
  ".docx",
  ".gif",
  ".jpeg",
  ".jpg",
  ".json",
  ".mp3",
  ".mp4",
  ".pdf",
  ".png",
  ".ppt",
  ".pptx",
  ".svg",
  ".txt",
  ".webm",
  ".webp",
  ".xls",
  ".xlsx",
  ".zip",
]);

function parseDocument(source, sourceName) {
  const normalized = source.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, body: normalized };
  }

  const closing = normalized.indexOf("\n---", 4);
  if (closing === -1) {
    throw new Error(`${sourceName}: front matter starts with --- but has no closing ---`);
  }

  const yamlSource = normalized.slice(4, closing);
  const bodyStart = normalized.indexOf("\n", closing + 4);
  const body = bodyStart === -1 ? "" : normalized.slice(bodyStart + 1);
  const data = parseYaml(yamlSource) ?? {};

  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${sourceName}: front matter must be a YAML object`);
  }

  return { data, body };
}

function firstHeading(body) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function stripLeadingTitle(body, title) {
  const match = body.match(/^\s*#\s+(.+)\r?\n+/);
  if (!match) return body.trim();
  return match[1].trim() === title.trim() ? body.slice(match[0].length).trim() : body.trim();
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[\[([^\]]+)\]\]/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferredSummary(body) {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((part) => plainText(part))
    .find((part) => part.length > 20);
  if (!paragraph) return "A note from Keyuan Hu.";
  return paragraph.length > 180 ? `${paragraph.slice(0, 177).trim()}...` : paragraph;
}

function slugify(value) {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `note-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`;
}

function normalizeDate(value) {
  const raw = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00Z`))) {
    throw new Error(`date must use YYYY-MM-DD, received "${raw}"`);
  }
  return raw;
}

function displayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function estimateReadTime(body) {
  const text = plainText(body);
  const latinWords = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const cjkCharacters = text.match(/[\u3400-\u9FFF]/g)?.length ?? 0;
  return `${Math.max(1, Math.ceil((latinWords + cjkCharacters / 2) / 220))} min`;
}

function isExternalTarget(target) {
  return (
    target.startsWith("/") ||
    target.startsWith("#") ||
    target.startsWith("mailto:") ||
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("data:")
  );
}

function splitTarget(target) {
  const match = target.match(/^([^?#]*)(.*)$/);
  return { pathname: match?.[1] ?? target, suffix: match?.[2] ?? "" };
}

function normalizeObsidianEmbeds(body) {
  return body.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
    const cleanTarget = target.trim();
    const cleanLabel = (label || path.basename(cleanTarget, path.extname(cleanTarget))).trim();
    return assetExtensions.has(path.extname(cleanTarget).toLowerCase()) &&
      ![".pdf", ".zip", ".csv", ".txt", ".json", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"].includes(
        path.extname(cleanTarget).toLowerCase(),
      )
      ? `![${cleanLabel}](${cleanTarget})`
      : `[${cleanLabel}](${cleanTarget})`;
  });
}

function replaceMarkdownTargets(body, replacer) {
  return body.replace(
    /(!?\[[^\]]*\]\()\s*(?:<([^>]+)>|([^\s)]+))(\s+(?:"[^"]*"|'[^']*'))?\s*(\))/g,
    (whole, prefix, angleTarget, plainTarget, optionalTitle = "", suffix) => {
      const target = angleTarget ?? plainTarget;
      const replacement = replacer(target);
      const renderedTarget = replacement.includes(" ") ? `<${replacement}>` : replacement;
      return `${prefix}${renderedTarget}${optionalTitle}${suffix}`;
    },
  );
}

function safeRelativePath(fromRoot, targetPath) {
  const relative = path.relative(fromRoot, targetPath);
  if (!relative || relative === ".") return path.basename(targetPath);
  return relative.startsWith("..") || path.isAbsolute(relative) ? path.basename(targetPath) : relative;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function importPost(sourceArgument, replaceExisting) {
  if (!sourceArgument) {
    throw new Error('Usage: npm run blog:import -- "/absolute/or/relative/path/article.md"');
  }

  const sourcePath = path.resolve(sourceArgument);
  const sourceStats = await stat(sourcePath);
  if (!sourceStats.isFile() || path.extname(sourcePath).toLowerCase() !== ".md") {
    throw new Error("The supplied path must be a Markdown (.md) file.");
  }

  const source = await readFile(sourcePath, "utf8");
  const parsed = parseDocument(source, sourcePath);
  const title = String(parsed.data.title ?? firstHeading(parsed.body) ?? path.basename(sourcePath, ".md")).trim();
  const slug = slugify(String(parsed.data.slug ?? title));
  const destination = path.join(postsRoot, slug);
  const stagingDestination = path.join(postsRoot, `.import-${slug}-${Date.now()}`);
  const destinationExists = await fileExists(destination);

  if (destinationExists && !replaceExisting) {
    throw new Error(
      `A post named "${slug}" already exists. Edit its index.md, or rerun with --replace to replace it.`,
    );
  }

  const sourceDirectory = path.dirname(sourcePath);
  let body = normalizeObsidianEmbeds(stripLeadingTitle(parsed.body, title));
  const copied = new Map();

  body = replaceMarkdownTargets(body, (target) => {
    if (isExternalTarget(target)) return target;
    const { pathname, suffix } = splitTarget(target);
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(pathname);
    } catch {
      decodedPath = pathname;
    }
    const absoluteAsset = path.resolve(sourceDirectory, decodedPath);
    const destinationRelative = path.join("assets", safeRelativePath(sourceDirectory, absoluteAsset));
    copied.set(target, { source: absoluteAsset, destinationRelative });
    return `${destinationRelative.split(path.sep).join("/")}${suffix}`;
  });

  const validatedAssets = [];
  for (const { source: assetSource, destinationRelative } of copied.values()) {
    if (!(await fileExists(assetSource))) {
      throw new Error(`Referenced local asset was not found: ${assetSource}`);
    }
    const assetStats = await stat(assetSource);
    if (!assetStats.isFile()) {
      throw new Error(`Referenced asset is not a file: ${assetSource}`);
    }
    validatedAssets.push({ assetSource, destinationRelative });
  }

  const today = new Date().toISOString().slice(0, 10);
  const summary = String(parsed.data.summary ?? inferredSummary(body)).trim();
  const tags = Array.isArray(parsed.data.tags)
    ? parsed.data.tags.map(String)
    : String(parsed.data.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const metadata = {
    title,
    date: normalizeDate(parsed.data.date ?? today),
    summary,
    lede: String(parsed.data.lede ?? summary).trim(),
    category: String(parsed.data.category ?? "Notes").trim(),
    tags,
    draft: parsed.data.draft === true,
  };
  if (parsed.data.readTime) metadata.readTime = String(parsed.data.readTime);
  if (parsed.data.visualLabel) metadata.visualLabel = String(parsed.data.visualLabel);
  const normalizedSource = `---\n${stringifyYaml(metadata).trim()}\n---\n\n${body.trim()}\n`;

  try {
    await mkdir(path.join(stagingDestination, "assets"), { recursive: true });
    for (const { assetSource, destinationRelative } of validatedAssets) {
      const destinationPath = path.join(stagingDestination, destinationRelative);
      await mkdir(path.dirname(destinationPath), { recursive: true });
      await cp(assetSource, destinationPath);
    }
    await writeFile(path.join(stagingDestination, "index.md"), normalizedSource);
    if (destinationExists) {
      await rm(destination, { recursive: true, force: true });
    }
    await rename(stagingDestination, destination);
  } catch (error) {
    await rm(stagingDestination, { recursive: true, force: true });
    throw error;
  }
  await buildPosts();

  console.log(`Imported: ${title}`);
  console.log(`Source: content/blog/posts/${slug}/index.md`);
  console.log(`URL: https://whosgit.github.io/blog/${slug}/`);
  console.log(`Assets copied: ${copied.size}`);
}

function rewritePostAssetTargets(body, slug, postDirectory) {
  return replaceMarkdownTargets(normalizeObsidianEmbeds(body), (target) => {
    if (isExternalTarget(target)) return target;
    const { pathname, suffix } = splitTarget(target);
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(pathname);
    } catch {
      decodedPath = pathname;
    }
    const absoluteAsset = path.resolve(postDirectory, decodedPath);
    const relativeAsset = path.relative(postDirectory, absoluteAsset);
    if (relativeAsset.startsWith("..") || path.isAbsolute(relativeAsset)) {
      throw new Error(`${slug}: asset references must remain inside the post directory (${target})`);
    }
    return `/blog-assets/${slug}/${relativeAsset.split(path.sep).join("/")}${suffix}`;
  });
}

function sanitizeRenderedHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "del",
      "details",
      "figcaption",
      "figure",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "summary",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      code: ["class"],
      img: ["src", "alt", "title", "loading"],
      td: ["align"],
      th: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      img: (_tagName, attributes) => ({
        tagName: "img",
        attribs: { ...attributes, loading: "lazy" },
      }),
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs:
          attributes.href?.startsWith("http://") || attributes.href?.startsWith("https://")
            ? { ...attributes, rel: "noreferrer" }
            : attributes,
      }),
    },
  });
}

async function buildPosts() {
  await mkdir(postsRoot, { recursive: true });
  if (!generatedAssetsRoot.endsWith(`${path.sep}public${path.sep}blog-assets`)) {
    throw new Error("Refusing to clean an unexpected generated asset directory.");
  }
  await rm(generatedAssetsRoot, { recursive: true, force: true });
  await mkdir(generatedAssetsRoot, { recursive: true });

  const entries = await readdir(postsRoot, { withFileTypes: true });
  const posts = [];

  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const slug = entry.name;
    if (slugify(slug) !== slug) {
      throw new Error(`${slug}: post directory names must use lowercase letters, numbers, and hyphens`);
    }

    const postDirectory = path.join(postsRoot, slug);
    const markdownPath = path.join(postDirectory, "index.md");
    if (!(await fileExists(markdownPath))) continue;

    const source = await readFile(markdownPath, "utf8");
    const parsed = parseDocument(source, markdownPath);
    if (parsed.data.draft === true) continue;

    const title = String(parsed.data.title ?? firstHeading(parsed.body) ?? "").trim();
    if (!title) throw new Error(`${slug}: title is required`);

    const body = stripLeadingTitle(parsed.body, title);
    const date = normalizeDate(parsed.data.date);
    const summary = String(parsed.data.summary ?? inferredSummary(body)).trim();
    const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [];
    const assetsDirectory = path.join(postDirectory, "assets");
    if (await fileExists(assetsDirectory)) {
      await cp(assetsDirectory, path.join(generatedAssetsRoot, slug, "assets"), { recursive: true });
    }

    const markdownForRender = rewritePostAssetTargets(body, slug, postDirectory);
    const rendered = marked.parse(markdownForRender, { gfm: true });
    const html = sanitizeRenderedHtml(String(rendered));

    posts.push({
      slug,
      title,
      summary,
      lede: String(parsed.data.lede ?? summary).trim(),
      category: String(parsed.data.category ?? "Notes").trim(),
      tags,
      date,
      displayDate: displayDate(date),
      readTime: String(parsed.data.readTime ?? estimateReadTime(body)),
      visualLabel: String(parsed.data.visualLabel ?? tags.slice(0, 3).join(" · ")),
      html,
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  await writeFile(generatedFile, `${JSON.stringify(posts, null, 2)}\n`);
  console.log(`Built ${posts.length} published Markdown post${posts.length === 1 ? "" : "s"}.`);
}

function printHelp() {
  console.log(`
Markdown blog tools

  npm run blog:import -- "/path/to/article.md"
  npm run blog:import -- "/path/to/article.md" --replace
  npm run blog:build

The importer reads YAML front matter when present, infers missing metadata,
copies referenced local images and attachments, and prints the final blog URL.
`.trim());
}

async function main() {
  const [command, ...arguments_] = process.argv.slice(2);
  if (command === "build") {
    await buildPosts();
    return;
  }
  if (command === "import") {
    const sourceArgument = arguments_.find((argument) => !argument.startsWith("--"));
    await importPost(sourceArgument, arguments_.includes("--replace"));
    return;
  }
  printHelp();
  if (command) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Blog tool error: ${error.message}`);
  process.exitCode = 1;
});
