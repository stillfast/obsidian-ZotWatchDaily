import { App, PluginSettingTab, Setting } from "obsidian";
import ZotWatchDailyPapersPlugin from "./main";
import { createI18n, type LanguageSetting } from "./i18n";

export type FileConflictPolicy = "overwrite" | "skip" | "createNew";

export interface PaperFieldsSettings {
	link: boolean;
	published: boolean;
	venue: boolean;
	tags: boolean;
	abstract: boolean;
	identifier: boolean;
}

export interface ZotWatchSettings {
	language: LanguageSetting;
	feedUrl: string;
	outputFolder: string;
	fileNameTemplate: string;
	recommendedCount: number | "all";
	conflictPolicy: FileConflictPolicy;
	openAfterCreate: boolean;
	fetchOnStartup: boolean;
	paperFields: PaperFieldsSettings;
}

export const DEFAULT_SETTINGS: ZotWatchSettings = {
	language: "auto",
	feedUrl: "https://stillfast.github.io/ZotWatch/feed.xml",
	outputFolder: "ZotWatch",
	fileNameTemplate: "Daily papers {{date}}",
	recommendedCount: 10,
	conflictPolicy: "overwrite",
	openAfterCreate: true,
	fetchOnStartup: false,
	paperFields: {
		link: true,
		published: true,
		venue: true,
		tags: true,
		abstract: true,
		identifier: false,
	},
};

export class ZotWatchSettingTab extends PluginSettingTab {
	plugin: ZotWatchDailyPapersPlugin;

	constructor(app: App, plugin: ZotWatchDailyPapersPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const { t } = createI18n(this.plugin.settings.language);

		new Setting(containerEl)
			.setName(t("settings.language.name"))
			.setDesc(t("settings.language.desc"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", t("settings.language.auto"))
					.addOption("en", t("settings.language.en"))
					.addOption("zh", t("settings.language.zh"))
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value as LanguageSetting;
						await this.plugin.saveSettings();
						this.display();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.feedUrl.name"))
			.setDesc(t("settings.feedUrl.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.feedUrl.placeholder"))
					.setValue(this.plugin.settings.feedUrl)
					.onChange(async (value) => {
						this.plugin.settings.feedUrl = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.outputFolder.name"))
			.setDesc(t("settings.outputFolder.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.outputFolder.placeholder"))
					.setValue(this.plugin.settings.outputFolder)
					.onChange(async (value) => {
						this.plugin.settings.outputFolder = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.fileNameTemplate.name"))
			.setDesc(t("settings.fileNameTemplate.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.fileNameTemplate.placeholder"))
					.setValue(this.plugin.settings.fileNameTemplate)
					.onChange(async (value) => {
						this.plugin.settings.fileNameTemplate = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.recommendedCount.name"))
			.setDesc(t("settings.recommendedCount.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.recommendedCount.placeholder"))
					.setValue(String(this.plugin.settings.recommendedCount))
					.onChange(async (value) => {
						const trimmed = value.trim().toLowerCase();
						if (trimmed === "all") {
							this.plugin.settings.recommendedCount = "all";
							await this.plugin.saveSettings();
							return;
						}

						const parsed = Number.parseInt(trimmed, 10);
						if (Number.isFinite(parsed) && parsed > 0) {
							this.plugin.settings.recommendedCount = parsed;
							await this.plugin.saveSettings();
						}
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.conflictPolicy.name"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("overwrite", t("settings.conflictPolicy.overwrite"))
					.addOption("skip", t("settings.conflictPolicy.skip"))
					.addOption("createNew", t("settings.conflictPolicy.createNew"))
					.setValue(this.plugin.settings.conflictPolicy)
					.onChange(async (value) => {
						this.plugin.settings.conflictPolicy = value as FileConflictPolicy;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.openAfterCreate.name"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.openAfterCreate).onChange(async (value) => {
					this.plugin.settings.openAfterCreate = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName(t("settings.fetchOnStartup.name"))
			.setDesc(t("settings.fetchOnStartup.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.fetchOnStartup).onChange(async (value) => {
					this.plugin.settings.fetchOnStartup = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl).setName(t("settings.paperFields.heading")).setHeading();

		const addFieldToggle = (
			name: string,
			key: keyof PaperFieldsSettings,
			desc?: string,
		) => {
			const setting = new Setting(containerEl).setName(name);
			if (desc) setting.setDesc(desc);
			setting.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.paperFields[key]).onChange(async (value) => {
					this.plugin.settings.paperFields[key] = value;
					await this.plugin.saveSettings();
				}),
			);
		};

		addFieldToggle(t("settings.paperFields.link"), "link");
		addFieldToggle(t("settings.paperFields.published"), "published");
		addFieldToggle(t("settings.paperFields.venue"), "venue");
		addFieldToggle(t("settings.paperFields.tags"), "tags");
		addFieldToggle(t("settings.paperFields.abstract"), "abstract");
		addFieldToggle(t("settings.paperFields.identifier"), "identifier");
	}
}
