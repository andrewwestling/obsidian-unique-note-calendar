import React from "react";
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

export const Empty = () => {
	return (
		<Agenda
			notesToShow={[]}
			onNoteClick={() => alert("No notes to click")}
		/>
	);
};
