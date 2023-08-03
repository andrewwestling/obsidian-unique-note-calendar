import React from "react";
import type { GlobalProvider } from "@ladle/react";
import { PluginContext } from "../src/components/PluginContext";
import { MOCK_APP as app, MOCK_PLUGIN as plugin } from "./mockData";

export const Provider: GlobalProvider = ({ children }) => (
	<PluginContext.Provider value={{ app, plugin }}>
		{children}
	</PluginContext.Provider>
);
