import React, { useEffect, useRef, useState } from "react";
import { Agenda } from "./Agenda";
import { MOCK_NOTES_TO_SHOW } from "../../.ladle/mockData";

export const WithNotes = () => {
	const todayRef = useRef<HTMLDivElement | null>(null);
	const scrollingContainerRef = useRef<HTMLDivElement | null>(null);

	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setLoaded(true);

		if (todayRef.current) {
			console.log("📆 Today: Scrolling to today...");
			todayRef.current.scrollIntoView({ behavior: "auto" });
		} else {
			console.log("📆 Today: No date matches today in the list");
		}
	}, [loaded]);

	return (
		<div ref={scrollingContainerRef}>
			<Agenda
				todayRef={todayRef}
				scrollContainerRef={scrollingContainerRef}
				notesToShow={MOCK_NOTES_TO_SHOW}
				onNoteClick={(note) => alert(`Clicked ${note.name}`)}
			/>
		</div>
	);
};

export const Empty = () => {
	const todayRef = useRef<HTMLDivElement | null>(null);
	const scrollingContainerRef = useRef<HTMLDivElement | null>(null);

	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setLoaded(true);

		if (todayRef.current) {
			console.log("📆 Today: Scrolling to today...");
			todayRef.current.scrollIntoView({ behavior: "auto" });
		} else {
			console.log("📆 Today: No date matches today in the list");
		}
	}, [loaded]);
	return (
		<div ref={scrollingContainerRef}>
			<Agenda
				todayRef={todayRef}
				scrollContainerRef={scrollingContainerRef}
				notesToShow={[]}
				onNoteClick={() => alert("No notes to click")}
			/>
		</div>
	);
};
