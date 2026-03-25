import type { ParsedFeedItem } from "./feed";
import type { I18nKey } from "./i18n";
import type { PaperFieldsSettings } from "./settings";

/**
 * Builds the daily Markdown note content for a list of papers.
 */
export function buildDailyMarkdown(input: {
	date: string;
	sourceUrl: string;
	items: ParsedFeedItem[];
	fields: PaperFieldsSettings;
	t: (key: I18nKey) => string;
}): string {
	const lines: string[] = [];

	lines.push(`# ${input.t("markdown.title")} (${input.date})`);
	lines.push("");
	lines.push(`- ${input.t("markdown.source")}: ${input.sourceUrl}`);
	lines.push(`- ${input.t("markdown.generated")}: ${formatLocalDateTime(new Date())}`);
	lines.push("");

	for (const [index, item] of input.items.entries()) {
		lines.push(`## ${index + 1}. ${item.title}`);
		lines.push("");

		if (input.fields.link && item.link) lines.push(`- ${input.t("markdown.link")}: ${item.link}`);
		if (input.fields.identifier && item.identifier) lines.push(`- ${input.t("markdown.identifier")}: ${item.identifier}`);
		if (input.fields.published && item.published) lines.push(`- ${input.t("markdown.published")}: ${item.published}`);
		if (input.fields.venue && item.venue) lines.push(`- ${input.t("markdown.venue")}: ${item.venue}`);
		if (input.fields.tags && item.tags && item.tags.length > 0) lines.push(`- ${input.t("markdown.tags")}: ${item.tags.join(", ")}`);

		if (input.fields.abstract && item.abstract) {
			lines.push("");
			lines.push(item.abstract);
		}

		lines.push("");
	}

	return lines.join("\n").trimEnd() + "\n";
}

function formatLocalDate(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function formatLocalDateTime(date: Date): string {
	const datePart = formatLocalDate(date);
	const hh = String(date.getHours()).padStart(2, "0");
	const mi = String(date.getMinutes()).padStart(2, "0");
	return `${datePart} ${hh}:${mi}`;
}
