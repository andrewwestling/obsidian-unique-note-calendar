import UniqueNoteCalendarPlugin from "main";
import { NoteWithDate } from "src/parseNotes";

export const MOCK_PLUGIN = {
	settings: { uniquePrefixFormat: "YYYYMMDDHHmm" },
} as UniqueNoteCalendarPlugin;

export const MOCK_NOTES_TO_SHOW: NoteWithDate[] = [
	{
		name: "202308022124 Reminders for violin shop",
		path: "202308022124 Reminders for violin shop.md",
		type: "note",
		date: "2023-08-03T01:24:00.000Z",
	},
	{
		name: "202307021555 Call with Sally (Offer call)",
		path: "Work/Calls/202307021555 Call with Sally (Offer call).md",
		type: "note",
		date: "2023-07-02T19:55:00.000Z",
	},
	{
		name: "202305271030 Rehearsal - City Symphony (dress rehearsal)",
		path: "Music/Rehearsals/202305271030 Rehearsal - City Symphony (dress rehearsal).md",
		type: "note",
		date: "2023-05-27T14:30:00.000Z",
	},
	{
		name: "202305231830 Rehearsal - City Symphony",
		path: "Music/Rehearsals/202305231830 Rehearsal - City Symphony.md",
		type: "note",
		date: "2023-05-23T22:30:00.000Z",
	},
	{
		name: "202305301400 Concert - City Symphony (Season Finale)",
		path: "Music/Concerts/202305301400 Concert - City Symphony (Season Finale).md",
		type: "note",
		date: "2023-05-30T18:00:00.000Z",
	},
	{
		name: "202302250305 Spring Repertoire",
		path: "Music/202302250305 Spring Repertoire.md",
		type: "note",
		date: "2023-02-25T08:05:00.000Z",
	},
	{
		name: "202307041400 Call with Joe (Catch-up, Fourth of July)",
		path: "Calls/202307041400 Call with Joe (Catch-up, Fourth of July).md",
		type: "note",
		date: "2023-07-04T18:00:00.000Z",
	},
	{
		name: "202306301030 Call with Dad (Planning the trip)",
		path: "Calls/202306301030 Call with Dad (Planning the trip).md",
		type: "note",
		date: "2023-06-30T14:30:00.000Z",
	},
	{
		name: "202212201130 Call with Dan's Auto (Volvo repair quote)",
		path: "Calls/202212201130 Call with Dan's Auto (Volvo repair quote).md",
		type: "note",
		date: "2022-12-20T16:30:00.000Z",
	},
	{
		name: "202303260000 Trip - Portland (for my birthday)",
		path: "Trips/202303260000 Trip - Portland (for my birthday).md",
		type: "note",
		date: "2023-03-26T04:00:00.000Z",
	},
	{
		name: "202307141746",
		path: "202307141746.md",
		type: "note",
		date: "2023-07-14T21:46:00.000Z",
	},
	{
		name: "202307311622",
		path: "202307311622.md",
		type: "note",
		date: "2023-07-31T20:22:00.000Z",
	},
	{
		name: "202307141744 Testing",
		path: "202307141744 Testing.md",
		type: "note",
		date: "2023-07-14T21:44:00.000Z",
	},
	{
		name: "202307131241 Grocery list",
		path: "202307131241 Grocery list.md",
		type: "note",
		date: "2023-07-13T16:41:00.000Z",
	},
];

export const MOCK_FOLDER_NAMES = [
	"Calls/",
	"Music/",
	"Music/Concerts/",
	"Music/Rehearsals/",
	"Trips/",
	"Work/",
	"Work/Calls/",
];
