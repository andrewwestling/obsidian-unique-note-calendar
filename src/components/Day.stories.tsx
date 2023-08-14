import React from "react";
import moment from "moment";
import { Day } from "./Day";
import { Event } from "./Event";
import { MOCK_NOTES_TO_SHOW } from "../../.ladle/mockData";

export const Empty = () => {
	return <Day date={moment("2023-07-14")}></Day>;
};

export const WithEvents = () => {
	// We use July 14, 2023 for this because there are multiple notes for this date in the mock data

	const justJuly14 = MOCK_NOTES_TO_SHOW.filter(
		(note) => parseInt(moment(note.date).format("YYYYMMDD")) === 20230714
	);

	return (
		<Day date={moment("2023-07-14")}>
			{justJuly14.map((note) => (
				<Event
					key={note.path}
					note={note}
					onNoteClick={(note) => alert(`Clicked ${note.name}`)}
				></Event>
			))}
		</Day>
	);
};

export const IsToday = () => {
	return (
		<Day date={moment()}>
			<Event
				note={MOCK_NOTES_TO_SHOW[0]}
				onNoteClick={(note) => alert(`Clicked ${note.name}`)}
			></Event>
		</Day>
	);
};
