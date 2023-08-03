import React from "react";
import type { GlobalProvider } from "@ladle/react";
import { PluginContext } from "../src/components/PluginContext";
import { MOCK_PLUGIN as plugin } from "./mockData";

export const Provider: GlobalProvider = ({ children }) => (
	<PluginContext.Provider value={{ plugin }}>
		{children}
	</PluginContext.Provider>
);
