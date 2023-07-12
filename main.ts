import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PluginSettings,
	UniqueNoteCalendarPluginSettingTab,
} from "src/settings";

export default class UniqueNoteCalendarPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
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
