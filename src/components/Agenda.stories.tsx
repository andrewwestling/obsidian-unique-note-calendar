import React, { useRef } from "react";
import { Agenda } from "./Agenda";
import { MOCK_NOTES_TO_SHOW } from "../../.ladle/mockData";

export const WithNotes = () => {
	return (
		<Agenda
			notesToShow={MOCK_NOTES_TO_SHOW}
			onNoteClick={(note) => alert(`Clicked ${note.name}`)}
		/>
	);
};

export const WithScrollToToday = () => {
	const containerRef = useRef(null);

	return (
		<div className="h-[90vh] overflow-y-auto">
			<div ref={containerRef}>
				<Agenda
					containerRef={containerRef}
					notesToShow={MOCK_NOTES_TO_SHOW}
					onNoteClick={(note) => alert(`Clicked ${note.name}`)}
				/>
			</div>
		</div>
	);
};

export const Empty = () => {
	return (
		<Agenda
			notesToShow={[]}
			onNoteClick={() => alert("No notes to click")}
		/>
	);
};
