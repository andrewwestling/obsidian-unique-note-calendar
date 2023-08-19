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
			className="w-full rounded-md"
			onChange={(event: ChangeEvent) =>
				onSelectFolderChange((event.target as HTMLSelectElement).value)
			}
		>
			{/* Create "All Folders" option at the top */}
			<option value={""}>🗂️ All Folders</option>

			{/* If no folders, create a disabled "No Folders" option */}
			{folderNames.length === 0 ? (
				<option disabled>No Folders</option>
			) : null}

			{/* Make an option for each folder */}
			{folderNames.map((folderName) => (
				<option key={folderName} value={folderName}>
					{folderName}
				</option>
			))}
		</select>
	);
};
