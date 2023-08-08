import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PluginSettings,
	UniqueNoteCalendarPluginSettingTab,
} from "src/settings";
import {
	AGENDA_SIDEBAR_VIEW_TYPE,
	UniqueNoteCalendarPluginAgendaView,
} from "src/agenda";

export default class UniqueNoteCalendarPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "unique-note-calendar--open-agenda",
			name: "Open Agenda",
			callback: async () => {
				const leafExists = this.app.workspace.getLeavesOfType(
					AGENDA_SIDEBAR_VIEW_TYPE
				).length;

				if (!leafExists) {
					await this.app.workspace.getRightLeaf(false).setViewState({
						type: AGENDA_SIDEBAR_VIEW_TYPE,
					});
				}

				this.app.workspace.revealLeaf(
					this.app.workspace.getLeavesOfType(
						AGENDA_SIDEBAR_VIEW_TYPE
					)[0]
				);
			},
		});

		this.addSettingTab(
			new UniqueNoteCalendarPluginSettingTab(this.app, this)
		);

		this.registerView(
			AGENDA_SIDEBAR_VIEW_TYPE,
			(leaf) => new UniqueNoteCalendarPluginAgendaView(leaf, this)
		);
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(AGENDA_SIDEBAR_VIEW_TYPE);
	}

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
