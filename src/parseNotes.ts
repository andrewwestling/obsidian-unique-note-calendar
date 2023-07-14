import { TFile, moment } from "obsidian";
import { PluginSettings } from "./settings";

export type NoteWithDate = {
	name: TFile["basename"];
	path: TFile["path"];
	date: string; // Truthfully this is an ISO 8601 date string, resulting from moment.Moment()
};

export const getNotesWithDates: (
	files: TFile[],
	uniquePrefixFormat: PluginSettings["uniquePrefixFormat"]
) => Promise<NoteWithDate[]> = async (files, uniquePrefixFormat) => {
	const notesWithDates: NoteWithDate[] = [];

	files.forEach((file) => {
		const date = moment(file.name, uniquePrefixFormat);
		if (date.isValid()) {
			notesWithDates.push({
				name: file.basename,
				path: file.path,
				date: moment(date).toISOString(),
			});
		}
	});

	return notesWithDates;
};

export type FolderTree = (Folder | NoteWithDate)[];
export interface Folder {
	name: string;
	children: (Folder | NoteWithDate)[];
}

export const makeFolderTree = (notesWithDates: NoteWithDate[]): FolderTree => {
	const folderTree: FolderTree = [];
	notesWithDates.forEach((note) => processPath(note, folderTree));

	return folderTree;
};

// Helper function to put the note into the correct part of the folderTree based on its path
const processPath = (noteWithDate: NoteWithDate, folderTree: FolderTree) => {
	// Split up the path into parts, like `["Work", "Calls", "Archived", "202307132342 Call with Joe.md"]`
	const pathParts = noteWithDate.path.split("/");

	// To keep track of the current level of the folder tree
	let currentLevel: (Folder | NoteWithDate)[] = folderTree;

	/**
	 * Important:
	 *
	 * This loop needs to go up until  `i < pathParts.length - 1` because the last pathPart is the filename itself
	 * and we don't want to create folders for the filenames
	 *
	 * ex. If pathParts comes in like `["Work", "Calls", "Archived", "202307132342 Call with Joe.md"]`,
	 * it needs to only process `["Work", "Calls", "Archived"]` because the last pathPart is the filename
	 */
	for (let i = 0; i < pathParts.length - 1; i++) {
		const folderName = pathParts[i];

		// Find the folder at this level
		let folder = currentLevel.find(
			(item) => item instanceof Object && item.name === folderName
		) as Folder;

		// Create the folder if it isn't found
		if (!folder) {
			folder = {
				name: folderName,
				children: [],
			};
			currentLevel.push(folder);
		}

		// Set the currentLevel to this folder for the next iteration
		currentLevel = folder.children;
	}

	// Once we're done drilling down into the folders, put the note in at the currentLevel
	currentLevel.push(noteWithDate);
};
