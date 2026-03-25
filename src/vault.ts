import { normalizePath, TFile, type App, type Vault } from "obsidian";
import type { FileConflictPolicy } from "./settings";

/**
 * Ensures the given folder path exists inside the vault by creating intermediate folders.
 */
export async function ensureFolderExists(vault: Vault, folderPath: string): Promise<void> {
	const normalized = normalizePath(folderPath);
	if (!normalized || normalized === ".") return;

	const parts = normalized.split("/").filter((p) => p.length > 0);
	let current = "";
	for (const part of parts) {
		current = current ? `${current}/${part}` : part;
		const existing = vault.getAbstractFileByPath(current);
		if (!existing) {
			await vault.createFolder(current);
		}
	}
}

/**
 * Creates or updates a Markdown file according to the configured conflict policy.
 */
export async function upsertMarkdownFile(
	app: App,
	targetPath: string,
	content: string,
	policy: FileConflictPolicy,
): Promise<{ path: string; createdOrModified: "created" | "modified" | "skipped" }> {
	const normalizedTarget = normalizePath(targetPath);
	const existing = app.vault.getAbstractFileByPath(normalizedTarget);

	if (existing instanceof TFile) {
		if (policy === "skip") return { path: normalizedTarget, createdOrModified: "skipped" };
		if (policy === "overwrite") {
			await app.vault.modify(existing, content);
			return { path: normalizedTarget, createdOrModified: "modified" };
		}
	}

	if (existing && policy === "createNew") {
		const { folder, baseName, ext } = splitPath(normalizedTarget);
		for (let i = 1; i < 1000; i++) {
			const candidate = normalizePath(`${folder}/${baseName} (${i}).${ext}`);
			const found = app.vault.getAbstractFileByPath(candidate);
			if (!found) {
				await app.vault.create(candidate, content);
				return { path: candidate, createdOrModified: "created" };
			}
		}
		throw new Error("Unable to find available filename.");
	}

	await app.vault.create(normalizedTarget, content);
	return { path: normalizedTarget, createdOrModified: "created" };
}

function splitPath(path: string): { folder: string; baseName: string; ext: string } {
	const normalized = normalizePath(path);
	const lastSlash = normalized.lastIndexOf("/");
	const filePart = lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized;
	const folder = lastSlash >= 0 ? normalized.slice(0, lastSlash) : "";
	const lastDot = filePart.lastIndexOf(".");
	if (lastDot <= 0) return { folder, baseName: filePart, ext: "md" };
	return { folder, baseName: filePart.slice(0, lastDot), ext: filePart.slice(lastDot + 1) };
}
