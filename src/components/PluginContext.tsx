import * as React from "react";
import UniqueNoteCalendarPlugin from "main";

export type PluginContextType = {
	plugin: UniqueNoteCalendarPlugin;
};

export const PluginContext = React.createContext<PluginContextType>({
	plugin: undefined as unknown as UniqueNoteCalendarPlugin,
});

export const usePluginContext = (): PluginContextType => {
	return React.useContext(PluginContext);
};
