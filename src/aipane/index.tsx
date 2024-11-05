/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { createRoot } from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import AIPane from "./components/Aipane";
import Clean from "./components/Clean";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const title = "SCTG AI Emailer Add-in";
const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;
// restore the original history functions
window.history.pushState = globalThis.backupHistoryFunctions.pushState;
window.history.replaceState = globalThis.backupHistoryFunctions.replaceState;
const BASE_PATH = process.env.website === "GITHUB_PAGES" ? "/ai-outlook" : "/";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AIPane title={title} />,
    },
    {
      path: "clean",
      element: <Clean />,
    },
  ],
  {
    basename: BASE_PATH,
  }
);

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(
    <FluentProvider theme={webLightTheme}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/Aipane", () => {
    const NextApp = require("./components/Aipane").default;
    root?.render(NextApp);
  });
}
