import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf, Platform } from "obsidian";
import UniqueNoteCalendarPlugin from "../main";
import { SidebarView } from "./components/SidebarView";
import { PluginContext } from "./components/PluginContext";
import "../tailwind.css";

export const RIGHT_SIDEBAR_LEAF_TYPE = "unique-note-calendar-right-sidebar";

export class UniqueNoteCalendarPluginSidebarView extends ItemView {
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
		return RIGHT_SIDEBAR_LEAF_TYPE;
	}

	getDisplayText(): string {
		return "Unique Note Calendar";
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
					<SidebarView app={this.app} />
				</PluginContext.Provider>
			</React.StrictMode>
		);
	}
}
