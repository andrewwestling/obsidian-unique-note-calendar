import { App } from "obsidian";
import UniqueNoteCalendarPlugin from "main";

export const MOCK_APP = {
	/**
	 *
	 * (Come back later and fix this)
	 *
	 * - Include what is used from `app` or refactor usage so we don't have to pass the whole `app` to the context
	 */
} as App;

export const MOCK_PLUGIN = {
	settings: { uniquePrefixFormat: "YYYYMMDDHHmm" },
} as UniqueNoteCalendarPlugin;

