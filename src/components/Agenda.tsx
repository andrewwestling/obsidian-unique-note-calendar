import React from "react";
import { getEventTitle } from "src/calendar";
import { NoteWithDate } from "src/parseNotes";
import { usePluginContext } from "./PluginContext";
import { TFile } from "obsidian";

export const Agenda = ({
	notesToShow = [],
}: {
	notesToShow: NoteWithDate[];
}) => {
	const { app, plugin } = usePluginContext();

	// What to do when clicking a note
	const noteClick = (
		note: NoteWithDate,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		const file = app.vault.getAbstractFileByPath(note.path);

		// Open in a new tab if command+click or control+click
		const shouldOpenInNewTab = event?.ctrlKey || event?.metaKey;

		if (shouldOpenInNewTab) {
			app.workspace.getLeaf("tab").openFile(file as TFile);
		} else {
			app.workspace.getMostRecentLeaf()?.openFile(file as TFile);
		}
	};

	return (
		<ul>
			{notesToShow.map((note) => (
				<li key={note.path}>
					<a onClick={(event) => noteClick(note, event)}>
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
