import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf, Platform } from "obsidian";
import UniqueNoteCalendarPlugin from "../main";
import { AgendaView } from "./components/AgendaView";
import { PluginContext } from "./components/PluginContext";
import "../tailwind.css";

export const AGENDA_SIDEBAR_VIEW_TYPE = "unique-note-calendar-agenda-sidebar";

export class UniqueNoteCalendarPluginAgendaView extends ItemView {
	plugin: UniqueNoteCalendarPlugin;
	reactRoot: Root;
	isMobileApp: boolean;

	constructor(leaf: WorkspaceLeaf, plugin: UniqueNoteCalendarPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.isMobileApp = Platform.isMobileApp;
	}

	getIcon(): string {
		return "calendar";
	}

	getViewType(): string {
		return AGENDA_SIDEBAR_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Unique Note Calendar: Agenda";
	}

	async onClose() {
		this.reactRoot.unmount();
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.addClass("use-tailwind");

		this.reactRoot = createRoot(container);
		this.reactRoot.render(
			<React.StrictMode>
				<PluginContext.Provider
					value={{
						plugin: this.plugin,
						isMobileApp: this.isMobileApp,
					}}
				>
					<AgendaView app={this.app} />
				</PluginContext.Provider>
			</React.StrictMode>
		);
	}
}
