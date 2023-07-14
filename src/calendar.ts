import { Calendar, EventClickArg, EventSourceInput } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import { moment } from "obsidian";
import { NoteWithDate } from "./parseNotes";
import { PluginSettings } from "./settings";

/**
 * Get event title for a note
 *
 * (This assumes the note's date is at the front of the filename)
 *
 * - Remove the date from the note's filename
 * - Return the part of the filename after the date
 */
export const getEventTitle = (
	note: NoteWithDate,
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

export const renderCalendar = ({
	calendarEl,
	events,
	eventClick,
}: {
	calendarEl: HTMLElement;
	events: EventSourceInput;
	eventClick?: (arg: EventClickArg) => void;
}): Calendar => {
	const calendar = new Calendar(calendarEl, {
		plugins: [listPlugin],
		initialView: "listMonth",
		height: "auto",
		events,
		eventClick,
		headerToolbar: {
			start: "title",
			right: "prev,next",
		},
	});

	calendar.render();

	return calendar;
};
