# 个人主页维护指南

这套网站把“内容”和“页面样式”分开了。日常更新通常只需要修改
`content/` 目录，不需要调整 React 页面代码。

## 1. 常用内容文件

| 想修改的内容 | 文件 |
| --- | --- |
| 姓名、邮箱、简介、链接 | `content/profile.json` |
| 主页 News | `content/news.json` |
| 研究方向与研究经历 | `content/research.json` |
| 项目 | `content/projects.json` |
| 论文与手稿 | `content/publications.json` |
| 博客文章 | `content/blog.ts` |

照片和 PDF 文件位于：

| 文件 | 用途 |
| --- | --- |
| `public/images/keyuan-hu.jpg` | 主页个人照片 |
| `public/files/keyuan-hu-cv-en.pdf` | 英文简历 |
| `public/files/keyuan-hu-cv-zh.pdf` | 中文简历 |

## 2. 最简单的修改方法：直接使用 GitHub 网页

1. 打开 `WhosGit/WhosGit.github.io` 仓库。
2. 找到需要修改的文件。
3. 点击右上角铅笔图标（Edit this file）。
4. 修改内容后点击 `Commit changes`。
5. 等待仓库的 `Actions` 页面中
   `Deploy personal website to GitHub Pages` 运行完成。
6. 通常一两分钟后刷新 `https://whosgit.github.io/` 即可看到新内容。

每次推送到 `master` 分支都会自动重新构建和发布网站。

## 3. 修改个人信息

编辑 `content/profile.json`。邮箱只需要修改一次：

```json
"email": "keyuanh3@illinois.edu"
```

`bio` 是主页上的简介段落。简介和 News 支持下面这种链接写法：

```text
[Illinois NSAI Lab](https://github.com/illinois-nsai)
```

JSON 文件必须使用英文双引号。相邻条目之间需要逗号，最后一个条目后不要加逗号。

## 4. 更新中英文简历

不用修改页面代码。直接在 GitHub 仓库中上传新版 PDF，并覆盖以下同名文件：

```text
public/files/keyuan-hu-cv-en.pdf
public/files/keyuan-hu-cv-zh.pdf
```

链接保持不变：

```text
https://whosgit.github.io/cv/en/
https://whosgit.github.io/cv/zh/
```

建议每次更新简历后检查：

- 邮箱和学校是否为最新；
- 教育及研究经历的时间是否一致；
- “under review” 没有误写成已发表；
- PDF 能否在电脑和手机上打开；
- 文件仍然是一页或你预期的页数。

## 5. 发布一条 News

打开 `content/news.json`，把最新条目添加到最上方：

```json
{
  "date": "Aug 2026",
  "text": "I started working on a new reinforcement-learning project."
}
```

News 应该简短、可核实，避免把计划写成已经完成的成果。

## 6. 添加项目

在 `content/projects.json` 中复制一个对象：

```json
{
  "date": "2026",
  "title": "Project name",
  "description": "One or two sentences describing the problem and your contribution.",
  "methods": "Python, PyTorch, systems",
  "link": "https://github.com/WhosGit/repository"
}
```

如果代码暂时不能公开，将 `link` 写成空字符串：

```json
"link": ""
```

## 7. 添加论文

在 `content/publications.json` 中复制一个对象：

```json
{
  "year": "2026",
  "title": "Paper title",
  "authors": "Author A, Keyuan Hu, and Author B.",
  "status": "Preprint",
  "paperUrl": "/files/paper-name.pdf",
  "codeUrl": "https://github.com/WhosGit/project"
}
```

若要上传论文 PDF：

1. 将 PDF 放到 `public/files/`；
2. 使用简短英文文件名，例如 `surg-gaze.pdf`；
3. 在 `paperUrl` 中填写 `/files/surg-gaze.pdf`。

论文状态建议只使用准确措辞，例如：

- `Manuscript in preparation`
- `Manuscript under review`
- `Preprint`
- `Accepted at ...`
- `Published in ...`

## 8. 发布博客

博客内容集中在 `content/blog.ts`。复制 `posts` 数组中的一个完整文章对象，
粘贴到数组最上方，然后修改：

- `slug`：网址标识，只使用小写英文、数字和连字符；
- `title`：文章标题；
- `summary`：博客列表中的摘要；
- `lede`：文章开头；
- `category`：`Research`、`Engineering` 或 `Reflection`；
- `tags`：主题标签；
- `date`：`YYYY-MM-DD`；
- `displayDate`：显示日期；
- `readTime`：预计阅读时间；
- `sections`：正文各节。

`slug` 不能与已有文章重复。例如：

```text
reading-notes-on-offline-rl
```

发布后的地址为：

```text
https://whosgit.github.io/blog/reading-notes-on-offline-rl/
```

## 9. 在本地预览

第一次使用：

```bash
npm install
```

启动预览：

```bash
npm run dev
```

检查 GitHub Pages 静态版本：

```bash
npm run lint
npm run build:github
```

## 10. 推荐的长期维护节奏

- 有明确的新身份、研究加入或成果时，更新 News；
- 每月整理一次项目、论文和博客草稿；
- 每次申请前更新两份 PDF 简历；
- 论文状态变化时立即更新 `publications.json`；
- 不公开尚未得到合作者许可的项目、数据和匿名审稿信息。
