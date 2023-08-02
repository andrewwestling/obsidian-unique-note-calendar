import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import UniqueNoteCalendarPlugin from "main";
import {
	FlatFolders,
	NoteWithDate,
	getFlatFolders,
	getNotesWithDates,
} from "./parseNotes";
import { Calendar, EventClickArg, EventInput } from "@fullcalendar/core";
import { getEventTitle, renderCalendar } from "./calendar";
import { SidebarView } from "./components/SidebarView";
import { PluginContext } from "./components/PluginContext";

export const RIGHT_SIDEBAR_LEAF_TYPE = "unique-note-calendar-right-sidebar";

export class UniqueNoteCalendarPluginSidebarView extends ItemView {
	plugin: UniqueNoteCalendarPlugin;
	reactRoot: Root;
	notesWithDates: NoteWithDate[];
	flatFolders: FlatFolders;
	folderNames: string[];
	optionNames: string[];
	selectedFolder: string;
	notesToShow: NoteWithDate[];
	calendar: Calendar | null = null;

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

	async getSidebarData(): Promise<void> {
		// Get notesWithDates
		this.notesWithDates = await getNotesWithDates(
			this.app.vault.getMarkdownFiles(),
			this.plugin.settings.uniquePrefixFormat
		);

		// Build flatFolders object
		this.flatFolders = getFlatFolders(this.notesWithDates);

		// Set up data for SelectFolder element
		this.folderNames =
			(this.flatFolders && Object.keys(this.flatFolders)) || [];

		// Set up notesToShow
		this.notesToShow = this.flatFolders[this.selectedFolder];
	}

	async onClose() {
		this.reactRoot.unmount();
	}

	async onOpen() {
		// Set up elements
		const container = this.containerEl.children[1];
		container.empty();

		this.reactRoot = createRoot(this.containerEl.children[1]);
		this.reactRoot.render(
			<React.StrictMode>
				<PluginContext.Provider
					value={{ app: this.app, plugin: this.plugin }}
				>
					<SidebarView />
				</PluginContext.Provider>
			</React.StrictMode>
		);

		const topEl = container.createEl("div");

		// Get initial data
		await this.getSidebarData();

		// Set up SelectFolder element
		const SelectFolder = topEl.createEl("select");
		SelectFolder.setCssStyles({ width: "100%", marginBottom: "12px" });
		SelectFolder.onchange = (event: Event) => {
			const selectedValue = (event.target as HTMLSelectElement).value;
			this.selectedFolder = selectedValue;

			if (selectedValue === "") {
				this.notesToShow = this.notesWithDates; // If selecting "All Folders", set notesToShow to the full set
			} else {
				this.notesToShow = this.flatFolders[selectedValue]; // Otherwise, set notesToShow to the corresponding value in flatFolders
			}

			// Call updateSidebarView when the value changes so the calendar will update
			updateSidebarView();
		};

		// Make options for SelectFolder from folderNames
		this.optionNames = [];
		const makeOptions = () => {
			SelectFolder.empty();

			// Create "All Folders" option at the top
			SelectFolder.createEl("option", {
				value: "",
				text: "🗂️ All Folders",
			});

			// Make an option for each folder
			this.folderNames.sort().forEach((folderName) => {
				this.optionNames.push(folderName);

				SelectFolder.createEl("option", {
					value: folderName,
					text: folderName,
				});
			});
		};
		makeOptions(); // Call it

		// Create Calendar element
		const calendarEl = container.createEl("div");

		// Create the FullCalendar EventInput objects from the notes
		const getEvents = async (
			specifiedNoteDates?: NoteWithDate[]
		): Promise<EventInput[]> => {
			let noteDates = specifiedNoteDates; // Use passed-in noteDates if it exists; if it doesn't, we want to return all notes

			if (!noteDates) {
				noteDates = this.notesWithDates;
			}

			return noteDates.map((note) => {
				return {
					title: getEventTitle(
						note,
						this.plugin.settings.uniquePrefixFormat
					),
					start: new Date(note.date),
					extendedProps: { path: note.path },
				};
			});
		};

		// What to do when clicking a calendar event
		const eventClick = (clicked: EventClickArg) => {
			const file = this.app.vault.getAbstractFileByPath(
				clicked.event.extendedProps.path
			);

			// Open in a new tab if command+click or control+click
			const shouldOpenInNewTab =
				clicked.jsEvent.getModifierState("Control") ||
				clicked.jsEvent.getModifierState("Meta");

			if (shouldOpenInNewTab) {
				this.app.workspace.getLeaf("tab").openFile(file as TFile);
			} else {
				this.app.workspace.getMostRecentLeaf()?.openFile(file as TFile);
			}
		};

		if (this.calendar) {
			this.calendar.destroy();
			this.calendar = null;
		}

		this.calendar = renderCalendar({
			calendarEl,
			events: async () => await getEvents(this.notesToShow || null),
			eventClick,
		});

		// Handler for events that should update the sidebar data
		const updateSidebarView = async () => {
			// First, get fresh data
			await this.getSidebarData();

			// Helper for comparing the new/old state of optionNames and folderNames
			const optionsAndFoldersMatch = (a: string[], b: string[]) =>
				a.length === b.length &&
				a.sort().every((v, i) => v === b.sort()[i]);

			// If there are changes to the folder structure, we need to regenerate the SelectFolder options
			if (!optionsAndFoldersMatch(this.optionNames, this.folderNames)) {
				this.optionNames = []; // Reset option names
				this.selectedFolder = ""; // Reset the selectedFolder because the SelectFolder element is gonna regenerate and the value will be out of sync
				makeOptions(); // Make new options for the SelectFolder component
			}

			// Regenerate calendar
			this.calendar?.refetchEvents();
		};

		// Register update events
		this.registerEvent(this.app.vault.on("create", updateSidebarView));
		this.registerEvent(this.app.vault.on("rename", updateSidebarView));
		this.registerEvent(this.app.vault.on("delete", updateSidebarView));
	}
}
