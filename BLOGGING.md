# Markdown 博客使用说明

博客以 Markdown 文件为唯一正文来源。文章、图片和附件都保存在网站仓库中，
因此以后更换框架或托管平台时仍然可以完整迁移。

## 1. 最简单的发布方式

把 Markdown 和它引用的图片、PDF 放在同一个文件夹中，例如：

```text
my-note/
├── note.md
├── system-diagram.png
└── paper.pdf
```

在网站项目目录中运行：

```bash
npm run blog:import -- "/完整路径/my-note/note.md"
```

工具会自动：

1. 读取 Markdown；
2. 复制正文实际引用的本地图片和附件；
3. 创建规范的文章目录；
4. 生成博客数据；
5. 显示文章最终网址。

然后运行以下命令预览：

```bash
npm run dev
```

确认无误后提交到 GitHub，GitHub Pages 会自动重新发布。

## 2. 推荐的 Markdown 模板

```markdown
---
title: Reading Notes on Offline RL
date: 2026-07-28
summary: A short description shown on the blog index.
lede: One or two sentences shown below the article title.
category: Research
tags:
  - Reinforcement Learning
  - Paper Note
draft: false
---

## The problem

Write the article normally in Markdown.

## Main observation

- A useful point
- Another point
```

只有 `title` 和 `date` 最值得主动填写。其他字段缺失时，导入工具会自动推断：

- `title`：使用正文第一个一级标题或文件名；
- `date`：使用导入当天；
- `summary`：使用正文第一个有效段落；
- `lede`：默认与摘要相同；
- `category`：默认为 `Notes`；
- `tags`：默认为空。

`draft: true` 的文章不会出现在网站中。

## 3. 图片和附件

图片使用普通 Markdown 相对路径：

```markdown
![System architecture](system-diagram.png)
```

PDF、代码压缩包或数据文件使用链接：

```markdown
[Read the annotated paper](paper.pdf)
```

也支持常见的 Obsidian 图片嵌入语法：

```markdown
![[system-diagram.png]]
```

导入后，文件会保存在：

```text
content/blog/posts/<slug>/assets/
```

构建网站时，它们会自动发布到：

```text
/blog-assets/<slug>/assets/
```

请尽量使用简短、稳定的英文文件名，例如：

```text
offline-rl-overview.png
experiment-results.csv
annotated-paper.pdf
```

## 4. 修改已经发布的文章

直接编辑：

```text
content/blog/posts/<slug>/index.md
```

图片和附件在同目录的 `assets/` 中。修改后运行：

```bash
npm run blog:build
npm run dev
```

如果希望用一个新的外部 Markdown 文件完全替换同名文章，可以运行：

```bash
npm run blog:import -- "/路径/new-version.md" --replace
```

`--replace` 会替换文章目录，因此使用前应确认新文件引用了所需的全部资源。

## 5. 支持的正文内容

目前支持常用 GitHub Flavored Markdown：

- 标题、段落、粗体、斜体和删除线；
- 有序与无序列表；
- 引用；
- 链接和图片；
- 行内代码和代码块；
- 表格；
- 分隔线；
- PDF、数据集和压缩包等附件链接。

数学公式可以在下一步加入 KaTeX；当前版本会把普通 LaTeX 源码当作文本显示。

## 6. 不在本地编辑时

最轻量的入口是 GitHub 自带的网页编辑器：

1. 打开网站仓库；
2. 按键盘上的 `.` 进入 `github.dev`；
3. 编辑 `content/blog/posts/` 中的 Markdown；
4. 上传图片到文章的 `assets/` 文件夹；
5. 提交修改，网站会自动发布。

如果以后希望使用更接近 WordPress 的网页后台，可以在保持当前 Markdown
目录不变的前提下接入 TinaCMS 或 Decap CMS，不需要迁移已有文章。
