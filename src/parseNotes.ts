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

/**
 * NotesByDay
 *
 * The keys are strings like `YYYY-MM-DD`, a Moment-formatted string representing a day
 *
 * The values are `NoteWithDate[]` and represent all the notes on that particular day
 *
 * ```json
 * {
 *   "2022-12-20": [{}],
 *   "2023-02-25": [{}],
 *   "2023-03-26": [{}],
 *   "2023-05-23": [{}],
 *   "2023-05-27": [{}],
 *   "2023-05-30": [{}],
 *   "2023-06-30": [{}],
 *   "2023-07-02": [{}],
 *   "2023-07-04": [{}],
 *   "2023-07-13": [{}],
 *   "2023-07-14": [{},{}],
 *   "2023-07-31": [{}],
 *   "2023-08-02": [{}],
 *   "2023-08-04": [{}],
 *   "2023-09-01": [{}],
 * }
 * ```
 */
export type NotesByDay = { [date: string]: NoteWithDate[] };
export const getNotesByDay = (notesWithDates: NoteWithDate[]) => {
	const notesByDay: NotesByDay = {};

	notesWithDates.forEach((note) => {
		const date = moment(note.date).format("YYYY-MM-DD");

		if (!notesByDay[date]) {
			notesByDay[date] = [];
		}

		notesByDay[date].push(note);
	});

	return notesByDay;
};

/**
 * Add 30 days (in either direction)
 * For each day, check if there is a matching key in notesByDay
 * If yes, add the notesByDay[date] to this day's events
 */
