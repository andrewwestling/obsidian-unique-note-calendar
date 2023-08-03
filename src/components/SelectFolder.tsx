import React, { ChangeEvent } from "react";

export const SelectFolder = ({
	onSelectFolderChange,
	folderNames,
}: {
	onSelectFolderChange: (newFolderName: string) => void;
	folderNames: string[];
}) => {
	return (
		<select
			style={{ width: "100%" }}
			onChange={(event: ChangeEvent) =>
				onSelectFolderChange((event.target as HTMLSelectElement).value)
			}
		>
			{/* Create "All Folders" option at the top */}
			<option value={""}>🗂️ All Folders</option>

			{/* Make an option for each folder */}
			{folderNames.map((folderName) => (
				<option key={folderName} value={folderName}>
					{folderName}
				</option>
			))}
		</select>
	);
};