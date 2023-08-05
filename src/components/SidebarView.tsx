import React, { useEffect, useRef, useState } from "react";
import { usePluginContext } from "./PluginContext";
import { NoteWithDate, getFlatFolders, getNotesWithDates } from "../parseNotes";
import { SelectFolder } from "./SelectFolder";
import { Agenda } from "./Agenda";
import { App, TFile } from "obsidian";

export const SidebarView = ({ app }: { app: App }) => {
	const { plugin } = usePluginContext();

	// State 😓
	const [isLoading, setIsLoading] = useState(true);
	const [notesWithDates, setNotesWithDates] = useState<NoteWithDate[]>([]);
	const [selectedFolder, setSelectedFolder] = useState<string>("");
	const [folderNames, setFolderNames] = useState<string[]>([]);
	const [notesToShow, setNotesToShow] = useState<NoteWithDate[]>([]);

	// Handler for getting sidebar data
	const getSidebarData = async () => {
		console.log("🔄 getSidebarData()");
		// Get notesWithDates
		const newNotesWithDates = await getNotesWithDates(
			app.vault.getMarkdownFiles(),
			plugin.settings.uniquePrefixFormat
		);

		// Build flatFolders object
		const flatFolders = getFlatFolders(newNotesWithDates);

		// Set up data for SelectFolder component
		const newFolderNames =
			(flatFolders && Object.keys(flatFolders)).sort() || [];

		// Set up notesToShow
		const newNotesToShow = flatFolders[selectedFolder] || notesWithDates; // Show all notes if no selectedFolder

		// Check if selectedFolder is still in newFolderNames (for handling if a folder gets renamed, etc)
		const newSelectedFolder =
			selectedFolder && !newFolderNames.includes(selectedFolder)
				? "" // Reset if the selectedFolder is no longer in newFolderNames
				: selectedFolder; // Otherwise keep selectedFolder set to its previous value

		// Save data in state
		setNotesWithDates(newNotesWithDates);
		setFolderNames(newFolderNames);
		setSelectedFolder(newSelectedFolder);
		setNotesToShow(newNotesToShow);

		return {
			notesWithDates: newNotesWithDates,
			folderNames: newFolderNames,
			selectedFolder: newSelectedFolder,
			notesToShow: newNotesToShow,
		};
	};

	// Update data when selectedFolder changes
	useEffect(() => {
		const getData = async () => {
			const { notesToShow } = await getSidebarData();
			setIsLoading(false); // Will become `false` when the await finishes

			console.log("🪩 in useEffect getData()", {
				notesToShow,
			});
		};

		getData();
	}, [isLoading, selectedFolder]);

	// Register update events
	plugin.registerEvent(app.vault.on("create", getSidebarData));
	plugin.registerEvent(app.vault.on("rename", getSidebarData));
	plugin.registerEvent(app.vault.on("delete", getSidebarData));

	// What to do when clicking a note
	const onNoteClick = (
		note: NoteWithDate,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		const file = app.vault.getAbstractFileByPath(note.path);

		// Open in a new tab if command+click or control+click
		const shouldOpenInNewTab = event?.ctrlKey || event?.metaKey;

		if (shouldOpenInNewTab) {
			app.workspace.getLeaf("tab").openFile(file as TFile);
		} else {
			app.workspace.getMostRecentLeaf()?.openFile(file as TFile);
		}
	};

	// For "Today" button
	const todayRef = useRef<null | HTMLDivElement>(null);
	const onTodayClick = () => {
		if (todayRef.current) {
			console.log("📆 Today: Scrolling to today...");
			todayRef.current.scrollIntoView({ behavior: "auto" });
		} else {
			console.log("📆 Today: No date matches today in the list");
		}
	};

	return (
		<div className="flex flex-col gap-3 h-screen-minus-header">
			{/* Top row: Reload button, SelectFolder */}
			<div className="flex flex-row gap-3 flex-0">
				{/* Reload button for debug/development */}
				<button
					className="flex-0 basis-8 border border-solid rounded-md"
					onClick={getSidebarData}
				>
					🔄
				</button>

				{/* "Today" button */}
				<button
					className="flex-0 basis-8 border border-solid rounded-md"
					onClick={onTodayClick}
				>
					Today
				</button>

				{/* SelectFolder dropdown */}
				<div className="flex-1">
					<SelectFolder
						onSelectFolderChange={setSelectedFolder}
						folderNames={folderNames}
					/>
				</div>
			</div>

			{/* Agenda: Days and Events */}
			<div className="flex-1 overflow-auto">
				<Agenda
					todayRef={todayRef}
					notesToShow={notesToShow}
					onNoteClick={onNoteClick}
				/>
			</div>
		</div>
	);
};
