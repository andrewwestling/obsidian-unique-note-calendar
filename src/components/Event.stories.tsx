import React from "react";
import { Event } from "./Event";
import { MOCK_NOTES_TO_SHOW } from "../../.ladle/mockData";

export const NoteEvent = () => {
	const note = MOCK_NOTES_TO_SHOW[0];
	return (
		<Event
			note={note}
			onNoteClick={(note) => alert(`Clicked ${note.name}`)}
		></Event>
	);
};
