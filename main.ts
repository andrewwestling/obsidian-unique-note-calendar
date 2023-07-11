import { Plugin } from "obsidian";

type PluginSettings = {
	dateFormats: {
		unique: string;
	};
};

export default class UniqueNoteCalendarPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			{ dateFormats: { unique: "YYYYMMDDHHmm" } },
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
