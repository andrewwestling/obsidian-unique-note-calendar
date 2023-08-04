import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf } from "obsidian";
import UniqueNoteCalendarPlugin from "../main";
import { SidebarView } from "./components/SidebarView";
import { PluginContext } from "./components/PluginContext";
import "../tailwind.css";

export const RIGHT_SIDEBAR_LEAF_TYPE = "unique-note-calendar-right-sidebar";

export class UniqueNoteCalendarPluginSidebarView extends ItemView {
	plugin: UniqueNoteCalendarPlugin;
	reactRoot: Root;

	constructor(leaf: WorkspaceLeaf, plugin: UniqueNoteCalendarPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getIcon(): string {
		return "calendar";
	}

	getViewType(): string {
		return RIGHT_SIDEBAR_LEAF_TYPE;
	}

	getDisplayText(): string {
		return "Unique Note Calendar";
	}

	async onClose() {
		this.reactRoot.unmount();
	}

	async onOpen() {
		this.reactRoot = createRoot(this.containerEl.children[1]);
		this.reactRoot.render(
			<React.StrictMode>
				<PluginContext.Provider value={{ plugin: this.plugin }}>
					<SidebarView app={this.app} />
				</PluginContext.Provider>
			</React.StrictMode>
		);
	}
}
