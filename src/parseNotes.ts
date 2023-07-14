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

/**
 * FlatFolders
 *
 * Looks like this:
 *
 * ```
 * {
 * 	"Calls/": NoteWithDate[],
 * 	"Music/": NoteWithDate[], // Includes notes in all subfolders of `/Music/...`
 * 	"Music/Rehearsals/": NoteWithDate[], // Includes only notes in `/Music/Rehearsals/...`
 * 	"Music/Concerts/": NoteWithDate[], // Only notes in `/Music/Concerts/...`
 * 	"Trips/": NoteWithDate[],
 * 	"Work/": NoteWithDate[], // All child notes in `/Work/...`
 * 	"Work/Calls/": NoteWithDate[], // Only notes in `/Work/Calls/...`
 * }
 * ```
 */
export type FlatFolders = { [flatPath: string]: NoteWithDate[] };
export const getFlatFolders = (notesWithDates: NoteWithDate[]) => {
	const flatFolders: FlatFolders = {};

	for (const note of notesWithDates) {
		const pathParts = note.path.split("/");
		let currentPath = "";

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
			currentPath += pathParts[i] + "/";

			// Create the folder if it isn't found
			if (!flatFolders[currentPath]) {
				flatFolders[currentPath] = [];
			}

			flatFolders[currentPath].push(note);
		}
	}

	return flatFolders;
};
