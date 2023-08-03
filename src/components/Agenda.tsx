import React from "react";
import { getEventTitle } from "src/calendar";
import { NoteWithDate } from "src/parseNotes";
import { usePluginContext } from "./PluginContext";

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
	const { plugin } = usePluginContext();

	return (
		<ul>
			{notesToShow.map((note) => (
				<li key={note.path}>
					<a onClick={(event) => onNoteClick(note, event)}>
						{getEventTitle(
							note,
							plugin.settings.uniquePrefixFormat
						)}
					</a>
				</li>
			))}
		</ul>
	);
};
