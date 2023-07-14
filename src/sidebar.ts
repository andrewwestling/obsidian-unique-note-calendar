import UniqueNoteCalendarPlugin from "main";
import { ItemView, WorkspaceLeaf } from "obsidian";
import {
	FlatFolders,
	NoteWithDate,
	getFlatFolders,
	getNotesWithDates,
} from "./parseNotes";

export const RIGHT_SIDEBAR_LEAF_TYPE = "unique-note-calendar-right-sidebar";

export class UniqueNoteCalendarPluginSidebarView extends ItemView {
	plugin: UniqueNoteCalendarPlugin;
	notesWithDates: NoteWithDate[];
	flatFolders: FlatFolders;
	folderNames: string[];
	optionNames: string[];
	selectedFolder: string;
	notesToShow: NoteWithDate[];

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
	}

	async onOpen() {
		// Set up elements
		const container = this.containerEl.children[1];
		container.empty();
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
		};

		// Register update events
		this.registerEvent(this.app.vault.on("create", updateSidebarView));
		this.registerEvent(this.app.vault.on("rename", updateSidebarView));
		this.registerEvent(this.app.vault.on("delete", updateSidebarView));
	}
}
