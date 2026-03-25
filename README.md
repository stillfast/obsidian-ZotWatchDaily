# ZotWatch Daily Papers

Fetch daily recommended papers from an RSS/Atom feed (e.g. ZotWatch) and generate a Markdown note in your Obsidian vault.

## Features

- Fetches `feed.xml` (RSS/Atom) and parses items into a normalized paper list
- Generates a daily Markdown note (one note per day)
- Configurable feed URL, output folder, file name template, and file conflict policy
- Configurable paper count (`10` or `all`) and output fields (link, venue, tags, abstract, etc.)
- UI language: English / 中文 (affects settings UI, notices, and command name)

## Usage

1. Enable the plugin.
2. Open **Command palette** and run: `Fetch daily papers (ZotWatch)` / `获取每日推荐论文（ZotWatch）`.
3. A daily note is created in your configured output folder.

## Settings

- Feed URL: RSS/Atom URL (default: `https://stillfast.github.io/ZotWatch/feed.xml`)
- Output folder: where to save generated notes (relative to vault root)
- File name template: supports `{{date}}` (YYYY-MM-DD)
- Paper count: number (e.g. `10`) or `all`
- File conflict policy: overwrite / skip / create new file
- Open after create: open the note after generation
- Fetch on startup: fetch once after Obsidian starts
- Paper fields: choose which metadata to include in the note
- Language: Auto / English / 中文

## Development

```bash
npm install
npm run dev
```

Build a production bundle:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Manual install

Copy these files into:

`<Vault>/.obsidian/plugins/<plugin-id>/`

- `main.js`
- `manifest.json`
- `styles.css` (optional)

## Privacy

This plugin only fetches the feed URL you configure and writes Markdown files into your vault. No telemetry.

---

# 中文说明

## ZotWatch Daily Papers 是什么？

从 RSS/Atom（例如 ZotWatch 的 `feed.xml`）获取每日推荐论文，并在你的 Obsidian 仓库中生成一个 Markdown 笔记（按天生成）。

## 使用方法

1. 启用插件。
2. 打开命令面板运行：`获取每日推荐论文（ZotWatch）`。
3. 插件会在设置的目录下生成当天的 Markdown 文件。

## 隐私

插件只会请求你在设置里填写的 Feed 地址，并把结果写入你的仓库文件夹；不包含任何隐藏统计与上传。
