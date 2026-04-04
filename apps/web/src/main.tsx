import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "@dupi/ui";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme='dark' storageKey='dupi-theme'>
			<BrowserRouter>
				<SidebarProvider defaultOpen={true}>
					<App />
				</SidebarProvider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>,
);
