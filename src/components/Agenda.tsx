import React, { Ref } from "react";
import { NoteWithDate, NotesByDay, getNotesByDay } from "../parseNotes";
import moment from "moment";
import { Day } from "./Day";
import { Event } from "./Event";

export const Agenda = ({
	todayRef = null,
	notesToShow = [],
	onNoteClick = () => {},
}: {
	todayRef?: Ref<HTMLDivElement>;
	notesToShow: NoteWithDate[];
	onNoteClick: (
		note: NoteWithDate,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => void;
}) => {
	const notesByDay: NotesByDay = getNotesByDay(notesToShow);

	// Get the earliest and latest dates
	let startDate = moment.min(
		Object.keys(notesByDay).map((date) => moment(date))
	);
	let endDate = moment.max(
		Object.keys(notesByDay).map((date) => moment(date))
	);

	// ! This is because my date parser screws up with things that look like dates but aren't (like "0000" or "Porsche Boxster 986" or "Saab 900")
	if (startDate.isBefore(moment("2010-01-01"))) {
		console.log("🌴 We had to reassign startDate!");
		startDate = moment("2010-01-01");
	}

	if (endDate.isAfter(moment("2030-01-01"))) {
		console.log("🌴 We had to reassign endDate!");
		endDate = moment("2030-01-01");
	}

	// Generate an array of dates between the earliest and latest dates
	const dateKeys = Array.from(
		{ length: endDate.diff(startDate, "days") + 1 },
		(_, index) => startDate.clone().add(index, "days").format("YYYY-MM-DD")
	); // This ends up like ["2023-08-04", "2023-08-05", ... etc]

	type Days = { date: string; notes: NoteWithDate[] }[];
	// Create days for making the `<Day>` list
	const days: Days = dateKeys.reduce((daysArray, date) => {
		daysArray.push({
			date,
			notes: notesByDay[date] || [], // If no notes for the date, use an empty array
		});
		return daysArray;
	}, [] as Days);

	return (
		<div className="flex flex-col">
			{days.map((day) => (
				<Day
					key={day.date}
					date={moment(day.date)}
					ref={
						moment().format("YYYY-MM-DD") === day.date
							? todayRef
							: null
					}
				>
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
