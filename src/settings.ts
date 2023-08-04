import UniqueNoteCalendarPlugin from "../main";
import { PluginSettingTab, App, Setting } from "obsidian";

export type PluginSettings = {
	uniquePrefixFormat: string;
};

export const DEFAULT_SETTINGS: PluginSettings = {
	uniquePrefixFormat: "YYYYMMDDHHmm",
};

export class UniqueNoteCalendarPluginSettingTab extends PluginSettingTab {
	plugin: UniqueNoteCalendarPlugin;

	constructor(app: App, plugin: UniqueNoteCalendarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Unique prefix format")
			.setDesc(
				"This should match the 'Unique prefix format' you set in the Unique Note Creator settings"
			)
			.addMomentFormat((text) =>
				text
					.setPlaceholder("YYYYMMDDHHmm")
					.setValue(this.plugin.settings.uniquePrefixFormat)
					.onChange(async (value) => {
						this.plugin.settings.uniquePrefixFormat = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
