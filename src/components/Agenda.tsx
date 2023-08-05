import React, { Ref, useEffect, useState } from "react";
import {
	DaysToShow,
	NoteWithDate,
	NotesByDay,
	getDaysToShow,
	getNotesByDay,
} from "../parseNotes";
import moment, { Moment } from "moment";
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
	const [loaded, setLoaded] = useState(false);
	const notesByDay: NotesByDay = getNotesByDay(notesToShow);
	const [daysToShow, setDaysToShow] = useState<DaysToShow>(
		getDaysToShow(notesByDay, moment())
	);
	const [referenceDate, setReferenceDate] = useState<Moment>(moment());

	const showPrev = () => {
		const newReferenceDate = moment(daysToShow[0].date);

		setReferenceDate(newReferenceDate);
		setDaysToShow(getDaysToShow(notesByDay, newReferenceDate));
	};

	const showNext = () => {
		const last = daysToShow.length - 1;
		const newReferenceDate = moment(daysToShow[last].date);

		setReferenceDate(newReferenceDate);
		setDaysToShow(getDaysToShow(notesByDay, newReferenceDate));
	};

	// Initial load
	useEffect(() => {
		setDaysToShow(getDaysToShow(notesByDay, referenceDate));
		setLoaded(true);
	}, [loaded]);

	// Update data when notesToShow changes
	useEffect(() => {
		setDaysToShow(getDaysToShow(notesByDay, referenceDate));
	}, [notesToShow]);

	return (
		<div className="flex flex-col">
			<button onClick={showPrev}>Previous</button>
			{daysToShow.map((day) => (
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
					{day.events.length > 0
						? day.events.map((note) => (
								<Event
									key={note.path}
									note={note}
									onNoteClick={onNoteClick}
								></Event>
						  ))
						: null}
				</Day>
			))}
			<button onClick={showNext}>Next</button>
		</div>
	);
};
