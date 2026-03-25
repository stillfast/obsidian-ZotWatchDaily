export type LanguageSetting = "auto" | "en" | "zh";
export type Language = "en" | "zh";

export type I18nKey =
	| "command.fetchDailyPapers"
	| "notice.missingFeedUrl"
	| "notice.fetchingFeed"
	| "notice.noItemsParsed"
	| "notice.created"
	| "notice.updated"
	| "notice.skipped"
	| "notice.failed"
	| "settings.feedUrl.name"
	| "settings.feedUrl.desc"
	| "settings.feedUrl.placeholder"
	| "settings.outputFolder.name"
	| "settings.outputFolder.desc"
	| "settings.outputFolder.placeholder"
	| "settings.fileNameTemplate.name"
	| "settings.fileNameTemplate.desc"
	| "settings.fileNameTemplate.placeholder"
	| "settings.recommendedCount.name"
	| "settings.recommendedCount.desc"
	| "settings.recommendedCount.placeholder"
	| "settings.conflictPolicy.name"
	| "settings.conflictPolicy.overwrite"
	| "settings.conflictPolicy.skip"
	| "settings.conflictPolicy.createNew"
	| "settings.openAfterCreate.name"
	| "settings.fetchOnStartup.name"
	| "settings.fetchOnStartup.desc"
	| "settings.language.name"
	| "settings.language.desc"
	| "settings.language.auto"
	| "settings.language.en"
	| "settings.language.zh"
	| "settings.paperFields.heading"
	| "settings.paperFields.link"
	| "settings.paperFields.published"
	| "settings.paperFields.venue"
	| "settings.paperFields.tags"
	| "settings.paperFields.abstract"
	| "settings.paperFields.identifier"
	| "markdown.title"
	| "markdown.source"
	| "markdown.generated"
	| "markdown.link"
	| "markdown.identifier"
	| "markdown.published"
	| "markdown.venue"
	| "markdown.tags";

type Dictionary = Record<I18nKey, string>;

const ZH: Dictionary = {
	"command.fetchDailyPapers": "获取每日推荐论文（ZotWatch）",
	"notice.missingFeedUrl": "ZotWatch：请先在设置里填写 Feed 地址",
	"notice.fetchingFeed": "ZotWatch：正在获取 feed…",
	"notice.noItemsParsed": "ZotWatch：未解析到任何条目（feed 可能为空或格式不支持）",
	"notice.created": "ZotWatch：已生成今日论文文件",
	"notice.updated": "ZotWatch：已更新今日论文文件",
	"notice.skipped": "ZotWatch：同名文件已存在，已按设置跳过",
	"notice.failed": "ZotWatch：获取或生成失败（详细错误见控制台）",
	"settings.feedUrl.name": "Feed 地址",
	"settings.feedUrl.desc": "支持 RSS/Atom（默认是 ZotWatch 的 feed.xml）",
	"settings.feedUrl.placeholder": "https://stillfast.github.io/ZotWatch/feed.xml",
	"settings.outputFolder.name": "保存位置（文件夹）",
	"settings.outputFolder.desc": "相对于仓库根目录，例如：ZotWatch 或 Research/Daily",
	"settings.outputFolder.placeholder": "ZotWatch",
	"settings.fileNameTemplate.name": "文件名模板",
	"settings.fileNameTemplate.desc": "支持变量：{{date}}（例如 2026-03-25）",
	"settings.fileNameTemplate.placeholder": "Daily papers {{date}}",
	"settings.recommendedCount.name": "推荐论文数量",
	"settings.recommendedCount.desc": "从 feed 中取前 N 条生成到每日文件；填 all 表示全部",
	"settings.recommendedCount.placeholder": "10 / all",
	"settings.conflictPolicy.name": "同名文件处理方式",
	"settings.conflictPolicy.overwrite": "覆盖",
	"settings.conflictPolicy.skip": "跳过",
	"settings.conflictPolicy.createNew": "创建新文件",
	"settings.openAfterCreate.name": "生成后打开文件",
	"settings.fetchOnStartup.name": "启动时自动获取",
	"settings.fetchOnStartup.desc": "Obsidian 启动后自动拉取一次（默认关闭）",
	"settings.language.name": "界面语言",
	"settings.language.desc": "影响命令名、提示与设置项显示，不影响已生成的历史笔记",
	"settings.language.auto": "自动",
	"settings.language.en": "English",
	"settings.language.zh": "中文",
	"settings.paperFields.heading": "论文属性（输出内容）",
	"settings.paperFields.link": "链接",
	"settings.paperFields.published": "发布时间",
	"settings.paperFields.venue": "期刊/会议（Venue）",
	"settings.paperFields.tags": "标签/分类",
	"settings.paperFields.abstract": "摘要",
	"settings.paperFields.identifier": "标识符（GUID/DOI）",
	"markdown.title": "每日论文",
	"markdown.source": "来源",
	"markdown.generated": "生成时间",
	"markdown.link": "链接",
	"markdown.identifier": "标识符",
	"markdown.published": "发布时间",
	"markdown.venue": "Venue",
	"markdown.tags": "标签",
};

const EN: Dictionary = {
	"command.fetchDailyPapers": "Fetch daily papers (ZotWatch)",
	"notice.missingFeedUrl": "ZotWatch: Set a feed URL in settings first.",
	"notice.fetchingFeed": "ZotWatch: Fetching feed…",
	"notice.noItemsParsed": "ZotWatch: No items parsed (empty feed or unsupported format).",
	"notice.created": "ZotWatch: Daily note created.",
	"notice.updated": "ZotWatch: Daily note updated.",
	"notice.skipped": "ZotWatch: File exists and was skipped by policy.",
	"notice.failed": "ZotWatch: Fetch or write failed (see console for details).",
	"settings.feedUrl.name": "Feed URL",
	"settings.feedUrl.desc": "Supports RSS/Atom (default is ZotWatch feed.xml).",
	"settings.feedUrl.placeholder": "https://example.com/feed.xml",
	"settings.outputFolder.name": "Output folder",
	"settings.outputFolder.desc": "Relative to vault root, e.g. ZotWatch or Research/Daily.",
	"settings.outputFolder.placeholder": "ZotWatch",
	"settings.fileNameTemplate.name": "File name template",
	"settings.fileNameTemplate.desc": "Supports {{date}} (e.g. 2026-03-25).",
	"settings.fileNameTemplate.placeholder": "Daily papers {{date}}",
	"settings.recommendedCount.name": "Paper count",
	"settings.recommendedCount.desc": "Takes the first N items; set to all for everything.",
	"settings.recommendedCount.placeholder": "10 / all",
	"settings.conflictPolicy.name": "File conflict policy",
	"settings.conflictPolicy.overwrite": "Overwrite",
	"settings.conflictPolicy.skip": "Skip",
	"settings.conflictPolicy.createNew": "Create new file",
	"settings.openAfterCreate.name": "Open after create",
	"settings.fetchOnStartup.name": "Fetch on startup",
	"settings.fetchOnStartup.desc": "Fetch once after Obsidian starts (default off).",
	"settings.language.name": "Language",
	"settings.language.desc": "Affects command name, notices, and settings UI.",
	"settings.language.auto": "Auto",
	"settings.language.en": "English",
	"settings.language.zh": "中文",
	"settings.paperFields.heading": "Paper fields (output)",
	"settings.paperFields.link": "Link",
	"settings.paperFields.published": "Published",
	"settings.paperFields.venue": "Venue",
	"settings.paperFields.tags": "Tags",
	"settings.paperFields.abstract": "Abstract",
	"settings.paperFields.identifier": "Identifier (GUID/DOI)",
	"markdown.title": "Daily papers",
	"markdown.source": "Source",
	"markdown.generated": "Generated",
	"markdown.link": "Link",
	"markdown.identifier": "Identifier",
	"markdown.published": "Published",
	"markdown.venue": "Venue",
	"markdown.tags": "Tags",
};

export function resolveLanguage(setting: LanguageSetting): Language {
	if (setting === "en" || setting === "zh") return setting;
	const navLang = window.navigator?.language?.toLowerCase() ?? "en";
	return navLang.startsWith("zh") ? "zh" : "en";
}

/**
 * Creates a tiny i18n helper for settings UI, notices, and Markdown labels.
 */
export function createI18n(setting: LanguageSetting): { lang: Language; t: (key: I18nKey) => string } {
	const lang = resolveLanguage(setting);
	const dict = lang === "zh" ? ZH : EN;
	return {
		lang,
		t: (key) => dict[key],
	};
}
