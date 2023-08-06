import React, { RefObject, useEffect, useRef, useState } from "react";
import "intersection-observer";
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
	todayRef,
	scrollContainerRef,
	todayClicked,
	notesToShow = [],
	onNoteClick = () => {},
}: {
	todayRef?: RefObject<HTMLDivElement>;
	scrollContainerRef?: RefObject<HTMLDivElement>;
	todayClicked?: number;
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

	const showToday = () => {
		const newReferenceDate = moment();

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

	// Update data if user clicks "Today" outside
	useEffect(() => {
		console.log("📆 Today: todayClicked changed");
		showToday();
	}, [todayClicked]);

	// For Infinite Scrolling
	const prevRef = useRef(null);
	const nextRef = useRef(null);

	const handlePrevIntersection: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const newReferenceDate = moment(daysToShow[0].date);

				console.log("⏪ showPrev()", {
					referenceDate: newReferenceDate.format("YYYY-MM-DD"),
				});
				showPrev();

				// Scroll user to previous position
				if (scrollContainerRef?.current) {
					const previousDateElement =
						scrollContainerRef?.current.children[0].children[1]; // This is arbitary, should use a ref but I'm tired
					const previousDateTop =
						previousDateElement.getBoundingClientRect().top;

					const offset = 64; // This is arbitrary, I think this relates to the height of the header; I measured it by hand and tweaked til it felt right

					const scrollAmount = previousDateTop - offset;

					console.log("Scrolling down to previous date", {
						previousDateElement,
						scrollAmount,
					});

					scrollContainerRef.current.scrollTop += scrollAmount;
				}
			}
		});
	};
	const handleNextIntersection: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const last = daysToShow.length - 1;
				const newReferenceDate = moment(daysToShow[last].date);

				console.log("⏩ showNext()", {
					referenceDate: newReferenceDate.format("YYYY-MM-DD"),
				});
				showNext();
			}
		});
	};

	useEffect(() => {
		const options = {
			root: null, // Use the viewport as the root
			rootMargin: "0px",
			threshold: 1.0, // When fully visible
		};

		const prevObserver = new IntersectionObserver(
			handlePrevIntersection,
			options
		);
		const nextObserver = new IntersectionObserver(
			handleNextIntersection,
			options
		);

		if (prevRef.current) {
			prevObserver.observe(prevRef.current);
		}

		if (nextRef.current) {
			nextObserver.observe(nextRef.current);
		}

		// Cleanup the observer when component unmounts
		return () => {
			if (prevRef.current) {
				prevObserver.unobserve(prevRef.current);
			}
			if (nextRef.current) {
				nextObserver.unobserve(nextRef.current);
			}
		};
	}, [daysToShow]);

	return (
		<div className="flex flex-col">
			<div ref={prevRef}></div>
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
			<div ref={nextRef}></div>
		</div>
	);
};
