import { Notice, normalizePath, Plugin, requestUrl, TFile } from "obsidian";
import { createI18n } from "./i18n";
import { parseFeedXml } from "./feed";
import { buildDailyMarkdown } from "./markdown";
import { DEFAULT_SETTINGS, type ZotWatchSettings, ZotWatchSettingTab } from "./settings";
import { ensureFolderExists, upsertMarkdownFile } from "./vault";

/**
 * Obsidian plugin that fetches papers from an RSS/Atom feed and writes a daily Markdown note.
 */
export default class ZotWatchDailyPapersPlugin extends Plugin {
	settings: ZotWatchSettings;

	async onload() {
		await this.loadSettings();

		const { t } = createI18n(this.settings.language);

		this.addCommand({
			id: "zotwatch-fetch-daily-papers",
			name: t("command.fetchDailyPapers"),
			callback: async () => {
				await this.fetchAndWriteDailyPapers({ openAfterCreate: this.settings.openAfterCreate });
			},
		});

		this.addSettingTab(new ZotWatchSettingTab(this.app, this));

		if (this.settings.fetchOnStartup) {
			const timeoutId = window.setTimeout(() => {
				void this.fetchAndWriteDailyPapers({ openAfterCreate: false, silent: true });
			}, 1200);
			this.register(() => window.clearTimeout(timeoutId));
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()) as Partial<ZotWatchSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Fetches the configured feed, converts items into Markdown, and writes it into the vault.
	 */
	private async fetchAndWriteDailyPapers(options?: { openAfterCreate?: boolean; silent?: boolean }) {
		const openAfterCreate = options?.openAfterCreate ?? false;
		const silent = options?.silent ?? false;

		const { t } = createI18n(this.settings.language);

		const { feedUrl } = this.settings;
		if (!feedUrl) {
			new Notice(t("notice.missingFeedUrl"));
			return;
		}

		try {
			if (!silent) new Notice(t("notice.fetchingFeed"));

			const response = await requestUrl({ url: feedUrl });
			const allItems = parseFeedXml(response.text);
			const items =
				this.settings.recommendedCount === "all"
					? allItems
					: allItems.slice(0, this.settings.recommendedCount);

			if (items.length === 0) {
				new Notice(t("notice.noItemsParsed"));
				return;
			}

			const today = formatLocalDate(new Date());
			const folderPath = normalizePath(this.settings.outputFolder || "ZotWatch");
			await ensureFolderExists(this.app.vault, folderPath);

			const baseName = (this.settings.fileNameTemplate || "Daily papers {{date}}")
				.replace(/\{\{date\}\}/g, today)
				.trim();
			const fileName = baseName.length > 0 ? baseName : `Daily papers ${today}`;

			const targetPathBase = normalizePath(`${folderPath}/${fileName}.md`);
			const markdown = buildDailyMarkdown({
				date: today,
				sourceUrl: feedUrl,
				items,
				fields: this.settings.paperFields,
				t,
			});

			const { path: targetPath, createdOrModified } = await upsertMarkdownFile(
				this.app,
				targetPathBase,
				markdown,
				this.settings.conflictPolicy,
			);

			if (!silent) {
				if (createdOrModified === "created") new Notice(t("notice.created"));
				else if (createdOrModified === "modified") new Notice(t("notice.updated"));
				else new Notice(t("notice.skipped"));
			}

			if (openAfterCreate && createdOrModified !== "skipped") {
				const file = this.app.vault.getAbstractFileByPath(targetPath);
				if (file instanceof TFile) {
					await this.app.workspace.getLeaf(true).openFile(file);
				}
			}
		} catch (error) {
			console.error(error);
			new Notice(t("notice.failed"));
		}
	}
}

function formatLocalDate(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}
