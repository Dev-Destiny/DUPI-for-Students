import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "@studify/ui";
import App from "./App";
import { queryClient } from "./lib/query-client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme='dark' storageKey='studify-theme'>
				<BrowserRouter>
					<SidebarProvider defaultOpen={true}>
						<App />
					</SidebarProvider>
				</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
