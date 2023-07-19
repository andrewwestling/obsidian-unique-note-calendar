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
 * The keys are strings that represent paths (`keyPath`)
 *
 * The values are `NoteWithDate[]` and represent all notes in all subfolders of the `keyPath`
 *
 * Example:
 *
 * For a filesystem like this:
 *
 * ```plaintext
 * 🗂️
 * ├─ Calls/
 * │  ├─ 2023XXXXXXXX Call with Joe.md
 * │  ├─ 2023XXXXXXXX Call with Joe.md
 * │  ├─ 2023XXXXXXXX Call with Joe.md
 * ├─ Music/
 * │  ├─ Concerts/
 * │  │  ├─ 2023XXXXXXXX Concert - City Symphony (Season Finale).md
 * │  ├─ Rehearsals/
 * │  │  ├─ 2023XXXXXXXX Rehearsal - City Symphony (for Season Finale).md
 * │  │  ├─ 2023XXXXXXXX Rehearsal - City Symphony (for Season Finale).md
 * │  ├─ 2023XXXXXXXX Spring Concert Repertoire.md
 * ├─ Trips/
 * │  ├─ 2023XXXXXXXX Trip to Portland.md
 * ├─ Work/
 * │  ├─ Calls/
 * │     ├─ 2023XXXXXXXX Call with Sally (Offer call).md
 * ```
 *
 * FlatFolders looks like this:
 *
 * ```json
 * {
 * 	"Calls/": [{}, {}, {}],
 * 	"Music/": [{}, {}, {}, {}], // Includes notes in `/Music` and in all subfolders of `/Music/../../etc`
 * 	"Music/Concerts/": [{}], // Includes notes in `/Music/Concerts/` and in all subfolders of `/Music/Concerts/../../etc`
 * 	"Music/Rehearsals/": [{}, {}], // Includes notes in `/Music/Rehearsals/` and in all subfolders of `/Music/Rehearsals/../../etc`
 * 	"Trips/": [{}],
 * 	"Work/": [{}], // `/Work/` and subfolders `/Work/../../etc`
 * 	"Work/Calls/": [{}], // `/Work/Calls` and subfolders `/Work/Calls/../../etc`
 * }
 * ```
 */
export type FlatFolders = { [flatPath: string]: NoteWithDate[] };
export const getFlatFolders = (notesWithDates: NoteWithDate[]) => {
	const flatFolders: FlatFolders = {};

	notesWithDates.forEach((note) => {
		const pathParts = note.path.split("/");
		const foldersToCreate = pathParts.slice(0, -1); // Exclude the last path part (filename)

		foldersToCreate.reduce(
			(subPath, folder) => {
				const fullPath = subPath + folder + "/";
				flatFolders[fullPath] = flatFolders[fullPath] || [];
				flatFolders[fullPath].push(note);
				return fullPath;
			},
			"" // Start from top of the tree
		);
	});

	return flatFolders;
};
