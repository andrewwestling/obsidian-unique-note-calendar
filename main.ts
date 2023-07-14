import { Notice, Plugin } from "obsidian";
import { getNotesWithDates, makeFolderTree } from "src/parseNotes";
import {
	DEFAULT_SETTINGS,
	PluginSettings,
	UniqueNoteCalendarPluginSettingTab,
} from "src/settings";

export default class UniqueNoteCalendarPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "test-getNoteDates",
			name: "Test: Get Note Dates",
			callback: async () => {
				const noteDates = await getNotesWithDates(
					this.app.vault.getMarkdownFiles(),
					this.settings.uniquePrefixFormat
				);

				console.log({ noteDates });

				const howMany = noteDates.length;
				const moreThanOne = howMany > 1;

				new Notice(
					`📝✅ Found ${howMany} ${
						moreThanOne ? "notes with dates" : "note with a date"
					}. Check the console to see the output.`
				);
			},
		});

		this.addCommand({
			id: "test-makeFolderTree",
			name: "Test: Make Folder Tree",
			callback: async () => {
				const folderTree = await getNotesWithDates(
					this.app.vault.getMarkdownFiles(),
					this.settings.uniquePrefixFormat
				).then(makeFolderTree);

				console.log({ folderTree });

				new Notice(
					"🗂️✅ Made the folder tree. Check the console to see the output."
				);
			},
		});

		this.addSettingTab(
			new UniqueNoteCalendarPluginSettingTab(this.app, this)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
