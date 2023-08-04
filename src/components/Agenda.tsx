import React from "react";
import { NoteWithDate } from "../parseNotes";
import moment from "moment";
import { Day } from "./Day";
import { Event } from "./Event";

export const Agenda = ({
	notesToShow = [],
	onNoteClick = () => {},
}: {
	notesToShow: NoteWithDate[];
	onNoteClick: (
		note: NoteWithDate,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => void;
}) => {
	// Create an object to store notes by date
	const notesByDate: { [date: string]: NoteWithDate[] } = {};

	// Iterate through the array and organize notes by date
	notesToShow.forEach((note) => {
		const date = moment(note.date).format("YYYY-MM-DD");

		if (!notesByDate[date]) {
			notesByDate[date] = [];
		}

		notesByDate[date].push(note);
	});

	// Get the earliest and latest dates
	const startDate = moment.min(
		Object.keys(notesByDate).map((date) => moment(date))
	);
	const endDate = moment.max(
		Object.keys(notesByDate).map((date) => moment(date))
	);

	// Generate an array of dates between the earliest and latest dates
	const dateKeys = Array.from(
		{ length: endDate.diff(startDate, "days") + 1 },
		(_, index) => startDate.clone().add(index, "days").format("YYYY-MM-DD")
	); // This ends up like ["2023-08-04", "2023-08-05", ... etc]

	// Create days for making the `<Day>` list
	const days: { date: string; notes: NoteWithDate[] }[] = dateKeys.reduce(
		(acc, date) => {
			acc.push({
				date,
				notes: notesByDate[date] || [], // If no notes for the date, use an empty array
			});
			return acc;
		},
		[] as { date: string; notes: NoteWithDate[] }[]
	);

	return (
		<div className="flex flex-col">
			{days.map((day) => (
				<Day key={day.date} date={moment(day.date)}>
					{/* This is ugly but it's fine I guess; need to return null if no notes so the empty state will render */}
					{day.notes.length > 0
						? day.notes.map((note) => (
								<Event
									key={note.path}
									note={note}
									onNoteClick={onNoteClick}
								></Event>
						  ))
						: null}
				</Day>
			))}
		</div>
	);
};
