import React from "react";
import type { GlobalProvider } from "@ladle/react";
import { PluginContext } from "../src/components/PluginContext";
import { MOCK_PLUGIN as plugin } from "./mockData";
import "../tailwind.css";

export const Provider: GlobalProvider = ({ children }) => (
	<PluginContext.Provider value={{ plugin }}>
		<div className="use-tailwind">{children}</div>
	</PluginContext.Provider>
);
