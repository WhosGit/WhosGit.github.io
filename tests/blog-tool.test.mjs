import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("imports Markdown with referenced images and attachments", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "keyuan-blog-tool-"));
  const sourceDirectory = path.join(temporaryRoot, "incoming");
  const projectDirectory = path.join(temporaryRoot, "site");
  await mkdir(sourceDirectory, { recursive: true });

  await writeFile(path.join(sourceDirectory, "figure.png"), "test-image");
  await writeFile(path.join(sourceDirectory, "supplement.pdf"), "test-pdf");
  await writeFile(
    path.join(sourceDirectory, "paper-note.md"),
    `---
title: A Test Paper Note
date: 2026-07-28
category: Research
tags: [RL, Systems]
---

# A Test Paper Note

This paragraph becomes the inferred summary for the imported note.

![System diagram](figure.png)

[Supplement](supplement.pdf)
`,
  );

  const result = spawnSync(
    process.execPath,
    [
      path.resolve("scripts/blog.mjs"),
      "import",
      path.join(sourceDirectory, "paper-note.md"),
    ],
    {
      cwd: path.resolve("."),
      encoding: "utf8",
      env: { ...process.env, BLOG_PROJECT_ROOT: projectDirectory },
    },
  );

  assert.equal(result.status, 0, result.stderr);
  const canonicalMarkdown = await readFile(
    path.join(
      projectDirectory,
      "content/blog/posts/a-test-paper-note/index.md",
    ),
    "utf8",
  );
  const generatedPosts = JSON.parse(
    await readFile(path.join(projectDirectory, "content/blog.generated.json")),
  );

  assert.match(canonicalMarkdown, /assets\/figure\.png/);
  assert.match(canonicalMarkdown, /assets\/supplement\.pdf/);
  assert.equal(generatedPosts[0].slug, "a-test-paper-note");
  assert.match(
    generatedPosts[0].html,
    /\/blog-assets\/a-test-paper-note\/assets\/figure\.png/,
  );
  assert.match(
    generatedPosts[0].html,
    /\/blog-assets\/a-test-paper-note\/assets\/supplement\.pdf/,
  );

  await readFile(
    path.join(
      projectDirectory,
      "public/blog-assets/a-test-paper-note/assets/figure.png",
    ),
  );
  await rm(temporaryRoot, { recursive: true, force: true });
});
