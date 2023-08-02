import * as React from "react";
import { usePluginContext } from "./PluginContext";

export const SidebarView = () => {
	const { app } = usePluginContext();

	return <h4>Hello, {app?.vault.getName()}!</h4>;
};
