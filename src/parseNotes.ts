import { MetadataCache, TFile } from "obsidian";
import moment, { Moment } from "moment";
import { PluginSettings } from "./settings";

type ISO8601 = string; // ISO 8601 dates are represented as a string, resulting from moment.Moment()

export type HeadingWithDate = {
	name: string;
	parent: NoteWithDate;
	type: "heading";
	date: ISO8601;
};

export type NoteWithDate = {
	name: TFile["basename"];
	path: TFile["path"];
	type: "note";
	date: ISO8601;
	headings?: HeadingWithDate[];
};

export const getNotesWithDates: (
	files: TFile[],
	uniquePrefixFormat: PluginSettings["uniquePrefixFormat"],
	metadataCache?: MetadataCache
) => Promise<NoteWithDate[]> = async (
	files,
	uniquePrefixFormat,
	metadataCache
) => {
	const notesWithDates: NoteWithDate[] = [];

	files.forEach((file) => {
		const date = moment(file.name, uniquePrefixFormat);
		if (date.isValid()) {
			// Get headings
			const fileHeadings =
				metadataCache?.getFileCache(file)?.headings || [];
			const headingsWithDates: HeadingWithDate[] = [];
			fileHeadings.forEach((heading) => {
				const headingDate = moment(
					heading.heading, // 🤢
					uniquePrefixFormat
				);
				if (headingDate.isValid()) {
					headingsWithDates.push({
						name: heading.heading, // 🤮
						parent: {
							name: file.basename,
							path: file.path,
							type: "note",
							date: moment(date).toISOString(),
						},
						type: "heading",
						date: moment(headingDate).toISOString(),
					});
				}
			});

			notesWithDates.push({
				name: file.basename,
				path: file.path,
				type: "note",
				date: moment(date).toISOString(),
				headings: headingsWithDates,
			});
		}
	});

	return notesWithDates;
};

/**
 * Get event title for a note
 *
 * (This assumes the note's date is at the front of the filename)
 *
 * - Remove the date from the note's filename
 * - Return the part of the filename after the date
 */
export const getEventTitle = (
	note: NoteWithDate | HeadingWithDate,
	uniquePrefixFormat: PluginSettings["uniquePrefixFormat"]
) => {
	const formattedDate = moment(note.date).format(uniquePrefixFormat);
	const nameParts = note.name.split(formattedDate); // "202305191400 Meeting - Check-in with Joe" becomes ["", " Meeting - Check-in with Joe"]

	// If note name only has a date (and nothing else), we use this default as the event title
	const defaultEventTitle: string = note.name; // Choosing to leave "202305191400" unchanged; could choose to render "Untitled Note" here instead?

	const eventTitle =
		nameParts[nameParts.length - 1].trim() || // "Meeting - Check-in with Joe"
		defaultEventTitle; // Otherwise the default event title for this note period ("202305191400")

	return eventTitle;
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
 * Same thing as NotesByDay, but for headings within a note
 */
export type HeadingsByDay = { [date: string]: HeadingWithDate[] };
export const getHeadingsByDay = (notesWithDates: NoteWithDate[]) => {
	const headingsByDay: HeadingsByDay = {};

	notesWithDates.forEach((note) => {
		note.headings?.forEach((heading) => {
			const date = moment(heading.date).format("YYYY-MM-DD");

			if (!headingsByDay[date]) {
				headingsByDay[date] = [];
			}

			headingsByDay[date].push(heading);
		});
	});

	return headingsByDay;
};

export type CombinedNotesAndHeadingsByDay = {
	[date: string]: (NoteWithDate | HeadingWithDate)[];
};
export const combineNotesAndHeadings = (
	notesByDay: NotesByDay,
	headingsByDay: HeadingsByDay
) => {
	const combined: CombinedNotesAndHeadingsByDay = {};

	// Add notes to the combined object
	for (const date in notesByDay) {
		if (!combined[date]) {
			combined[date] = notesByDay[date];
		}
	}

	// Add headings to the combined object, merging if date already exists
	for (const date in headingsByDay) {
		if (!combined[date]) {
			combined[date] = headingsByDay[date];
		} else {
			combined[date] = combined[date].concat(headingsByDay[date]);
		}
	}

	return combined;
};

/**
 * DaysToShow
 *
 * This is an array of objects representing a "day" on the Agenda
 *
 * The `getDaysToShow(combinedNotesAndHeadingsByDay, referenceDate)` function generates this, where you pass in a `referenceDate` and it generates a `daysToShow` array for 30 days before and after that date
 *
 * DaysToShow looks like this:
 *
 * ```json
 * [
 *   { "date": "2023-07-06", "events": [] },
 *   { "date": "2023-07-07", "events": [] },
 *   { "date": "2023-07-08", "events": [] },
 *   { "date": "2023-07-09", "events": [] },
 *   { "date": "2023-07-10", "events": [] },
 *   { "date": "2023-07-11", "events": [] },
 *   { "date": "2023-07-12", "events": [] },
 *   { "date": "2023-07-13", "events": [{}] },
 *   { "date": "2023-07-14", "events": [{},{}] },
 *   { "date": "2023-07-15", "events": [] },
 *   { "date": "2023-07-16", "events": [] },
 *   { "date": "2023-07-17", "events": [] },
 *   { "date": "2023-07-18", "events": [] },
 *   { "date": "2023-07-19", "events": [] },
 *   { "date": "2023-07-20", "events": [] },
 *   { "date": "2023-07-21", "events": [] },
 *   { "date": "2023-07-22", "events": [] },
 *   { "date": "2023-07-23", "events": [] },
 *   { "date": "2023-07-24", "events": [] },
 *   { "date": "2023-07-25", "events": [] },
 *   { "date": "2023-07-26", "events": [] },
 *   { "date": "2023-07-27", "events": [] },
 *   { "date": "2023-07-28", "events": [] },
 *   { "date": "2023-07-29", "events": [] },
 *   { "date": "2023-07-30", "events": [] },
 *   { "date": "2023-07-31", "events": [{}] },
 *   { "date": "2023-08-01", "events": [] },
 *   { "date": "2023-08-02", "events": [{}] },
 *   { "date": "2023-08-03", "events": [] },
 *   { "date": "2023-08-04", "events": [{}] },
 *   { "date": "2023-08-05", "events": [] },
 *   { "date": "2023-08-06", "events": [] },
 *   { "date": "2023-08-07", "events": [] },
 *   { "date": "2023-08-08", "events": [] },
 *   { "date": "2023-08-09", "events": [] },
 *   { "date": "2023-08-10", "events": [] },
 *   { "date": "2023-08-11", "events": [] },
 *   { "date": "2023-08-12", "events": [] },
 *   { "date": "2023-08-13", "events": [] },
 *   { "date": "2023-08-14", "events": [] },
 *   { "date": "2023-08-15", "events": [] },
 *   { "date": "2023-08-16", "events": [] },
 *   { "date": "2023-08-17", "events": [] },
 *   { "date": "2023-08-18", "events": [] },
 *   { "date": "2023-08-19", "events": [] },
 *   { "date": "2023-08-20", "events": [] },
 *   { "date": "2023-08-21", "events": [] },
 *   { "date": "2023-08-22", "events": [] },
 *   { "date": "2023-08-23", "events": [] },
 *   { "date": "2023-08-24", "events": [] },
 *   { "date": "2023-08-25", "events": [] },
 *   { "date": "2023-08-26", "events": [] },
 *   { "date": "2023-08-27", "events": [] },
 *   { "date": "2023-08-28", "events": [] },
 *   { "date": "2023-08-29", "events": [] },
 *   { "date": "2023-08-30", "events": [] },
 *   { "date": "2023-08-31", "events": [] },
 *   { "date": "2023-09-01", "events": [{}] },
 *   { "date": "2023-09-02", "events": [] },
 *   { "date": "2023-09-03", "events": [] },
 *   { "date": "2023-09-04", "events": [] }
 * ]
 * ```
 */
export type DaysToShow = {
	date: string;
	events: (NoteWithDate | HeadingWithDate)[];
}[];
export const getDaysToShow = (
	combinedNotesAndHeadingsByDay: CombinedNotesAndHeadingsByDay,
	referenceDate: Moment
) => {
	const HOW_MANY_DAYS = 120; // This represents the total number of days that will be in the array

	const startDate = referenceDate.clone().subtract(HOW_MANY_DAYS / 2, "days"); // Half before referenceDate
	const endDate = referenceDate.clone().add(HOW_MANY_DAYS / 2, "days"); // Half after referenceDate

	const dateStrings: string[] = Array.from(
		{ length: endDate.diff(startDate, "days") + 1 },
		(_, index) => startDate.clone().add(index, "days").format("YYYY-MM-DD")
	); // This is like ["2023-08-01", "2023-08-02", "2023-08-03", ...etc]

	const daysToShow: DaysToShow = dateStrings.reduce((daysArray, date) => {
		const sortedEvents = combinedNotesAndHeadingsByDay[date]?.sort(
			(a, b) => {
				if (moment(a.date).isBefore(b.date)) {
					return -1;
				} else {
					return 1;
				}
			}
		);

		daysArray.push({
			date,
			events: sortedEvents || [], // If no notes for the date, use an empty array
		});
		return daysArray;
	}, [] as DaysToShow);

	return daysToShow;
};
