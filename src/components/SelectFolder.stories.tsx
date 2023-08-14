import React from "react";
import { SelectFolder } from "./SelectFolder";
import { MOCK_FOLDER_NAMES } from "../../.ladle/mockData";

export const WithFolders = () => {
	return (
		<SelectFolder
			folderNames={MOCK_FOLDER_NAMES}
			onSelectFolderChange={(newFolderName) =>
				alert(`Change folder to ${newFolderName}`)
			}
		/>
	);
};

export const Empty = () => {
	return (
		<SelectFolder
			folderNames={[]}
			onSelectFolderChange={() => alert("No folders")}
		/>
	);
};
