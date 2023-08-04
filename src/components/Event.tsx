import moment from "moment";
import React from "react";
import { getEventTitle } from "../calendar";
import { NoteWithDate } from "../parseNotes";
import { usePluginContext } from "./PluginContext";

export const Event = ({
	note,
	onNoteClick,
}: {
	note: NoteWithDate;
	onNoteClick: (
		note: NoteWithDate,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => void;
}) => {
	const { plugin } = usePluginContext();

	return (
		<div
			className="p-2 border border-solid border-l-4 rounded-md flex flex-row gap-3"
			key={note.path}
		>
			{/* Note title and link */}
			<div className="flex-1">
				<a
					className="cursor-pointer"
					onClick={(event) => onNoteClick(note, event)}
				>
					{getEventTitle(note, plugin.settings.uniquePrefixFormat)}
				</a>
			</div>

			{/* Date label */}
			<label className="flex-0 text-xs">
				{moment(note.date).format("h:mm a")}
			</label>
		</div>
	);
};
