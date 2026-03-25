export type ParsedFeedItem = {
	title: string;
	link?: string;
	identifier?: string;
	published?: string;
	venue?: string;
	tags?: string[];
	abstract?: string;
};

/**
 * Parses an RSS/Atom XML string into a normalized list of feed items.
 * Supports RSS 2.0 (<item>) and Atom (<entry>) formats.
 */
export function parseFeedXml(xmlText: string): ParsedFeedItem[] {
	const doc = new DOMParser().parseFromString(xmlText, "text/xml");
	const parserError = doc.querySelector("parsererror");
	if (parserError) return [];

	const rssItems = Array.from(doc.querySelectorAll("item"));
	if (rssItems.length > 0) return rssItems.map(parseRssItem).filter((i) => i.title.length > 0);

	const atomEntries = Array.from(doc.querySelectorAll("entry"));
	if (atomEntries.length > 0) return atomEntries.map(parseAtomEntry).filter((i) => i.title.length > 0);

	return [];
}

function parseRssItem(itemEl: Element): ParsedFeedItem {
	const title = getText(itemEl, "title");
	const link = getText(itemEl, "link") || undefined;
	const identifier = getText(itemEl, "guid") || undefined;
	const published = getText(itemEl, "pubDate") || undefined;
	const tags = Array.from(itemEl.querySelectorAll("category"))
		.map((el) => (el.textContent ?? "").trim())
		.filter((v) => v.length > 0);

	const rawDescription = getText(itemEl, "description") || "";
	const { abstract, venueFromDescription, publishedFromDescription } = extractDescriptionMetadata(rawDescription);
	const venue = getText(itemEl, "category") || venueFromDescription || undefined;

	return {
		title,
		link,
		identifier,
		published: publishedFromDescription || published,
		venue,
		tags: tags.length > 0 ? uniqueStrings(tags) : undefined,
		abstract,
	};
}

function parseAtomEntry(entryEl: Element): ParsedFeedItem {
	const title = getText(entryEl, "title");
	const linkEl = entryEl.querySelector("link[href]");
	const link = linkEl?.getAttribute("href")?.trim() || getText(entryEl, "link") || undefined;
	const identifier = getText(entryEl, "id") || undefined;
	const published = getText(entryEl, "published") || getText(entryEl, "updated") || undefined;

	const tags = Array.from(entryEl.querySelectorAll("category"))
		.map((el) => el.getAttribute("term")?.trim() ?? (el.textContent ?? "").trim())
		.filter((v) => v.length > 0);

	const rawSummary = getText(entryEl, "summary") || getText(entryEl, "content") || "";
	const { abstract, venueFromDescription, publishedFromDescription } = extractDescriptionMetadata(rawSummary);

	return {
		title,
		link,
		identifier,
		published: publishedFromDescription || published,
		venue: venueFromDescription || undefined,
		tags: tags.length > 0 ? uniqueStrings(tags) : undefined,
		abstract,
	};
}

function extractDescriptionMetadata(raw: string): {
	abstract?: string;
	venueFromDescription?: string;
	publishedFromDescription?: string;
} {
	const text = htmlToText(raw).trim();
	if (!text) return {};

	const publishedFromDescription = extractLabeledValue(text, "Published");
	const venueFromDescription = extractLabeledValue(text, "Venue");
	const abstract = extractAbstract(text);

	return {
		abstract: abstract || undefined,
		venueFromDescription: venueFromDescription || undefined,
		publishedFromDescription: publishedFromDescription || undefined,
	};
}

function extractLabeledValue(text: string, label: string): string | undefined {
	const lines = text.split(/\r?\n/).map((l) => l.trim());
	const prefix = `${label}:`;
	for (const line of lines) {
		if (line.startsWith(prefix)) {
			const value = line.slice(prefix.length).trim();
			return value.length > 0 ? value : undefined;
		}
	}
	return undefined;
}

function extractAbstract(text: string): string | undefined {
	const publishedIndex = text.indexOf("Published:");
	const raw = publishedIndex > 0 ? text.slice(0, publishedIndex).trim() : text.trim();
	const cleaned = raw.replace(/^Abstract\s+/i, "").trim();
	return cleaned.length > 0 ? cleaned : undefined;
}

function htmlToText(html: string): string {
	const parsed = new DOMParser().parseFromString(html, "text/html");
	return (parsed.body?.textContent ?? "").replace(/\u00a0/g, " ");
}

function getText(parent: Element, selector: string): string {
	return (parent.querySelector(selector)?.textContent ?? "").trim();
}

function uniqueStrings(values: string[]): string[] {
	const set = new Set<string>();
	for (const v of values) set.add(v);
	return Array.from(set);
}
