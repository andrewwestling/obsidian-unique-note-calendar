import * as React from "react";
import { App } from "obsidian";
import UniqueNoteCalendarPlugin from "main";

export type PluginContextType = {
	app: App;
	plugin: UniqueNoteCalendarPlugin;
};

export const PluginContext = React.createContext<PluginContextType>({
	app: undefined as unknown as App,
	plugin: undefined as unknown as UniqueNoteCalendarPlugin,
});

export const usePluginContext = (): PluginContextType => {
	return React.useContext(PluginContext);
};
