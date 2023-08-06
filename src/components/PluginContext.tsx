import * as React from "react";
import UniqueNoteCalendarPlugin from "../../main";

export type PluginContextType = {
	plugin: UniqueNoteCalendarPlugin;
	isMobileApp: boolean;
};

export const PluginContext = React.createContext<PluginContextType>({
	plugin: undefined as unknown as UniqueNoteCalendarPlugin,
	isMobileApp: false,
});

export const usePluginContext = (): PluginContextType => {
	return React.useContext(PluginContext);
};
