import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);

async function readOutput(path) {
  return readFile(new URL(path, outputRoot), "utf8");
}

test("exports the academic homepage with current contact information", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /Keyuan Hu/);
  assert.match(html, /keyuanh3@illinois\.edu/);
  assert.match(html, />News</);
  assert.match(html, />Research</);
  assert.match(html, /Illinois Networked Systems and Artificial Intelligence Lab/);
  assert.match(html, /images\/keyuan-hu\.jpg/);
});

test("exports independent English and Chinese PDF CV pages", async () => {
  const [english, chinese] = await Promise.all([
    readOutput("cv/en/index.html"),
    readOutput("cv/zh/index.html"),
  ]);

  assert.match(english, /files\/keyuan-hu-cv-en\.pdf/);
  assert.match(chinese, /files\/keyuan-hu-cv-zh\.pdf/);

  await Promise.all([
    access(new URL("files/keyuan-hu-cv-en.pdf", outputRoot)),
    access(new URL("files/keyuan-hu-cv-zh.pdf", outputRoot)),
  ]);
});

test("exports the blog index and every configured post", async () => {
  const html = await readOutput("blog/index.html");

  assert.match(html, /Keyuan Hu&#x27;s Notes/);
  assert.match(html, /building-smartmentor-as-a-real-rag-system/);
  assert.match(html, /what-paxos-teaches-about-clear-thinking/);
  assert.match(html, /why-this-site-is-a-working-notebook/);

  await Promise.all([
    access(
      new URL(
        "blog/building-smartmentor-as-a-real-rag-system/index.html",
        outputRoot,
      ),
    ),
    access(
      new URL(
        "blog/what-paxos-teaches-about-clear-thinking/index.html",
        outputRoot,
      ),
    ),
  ]);
});
