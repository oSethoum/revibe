import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/lib/i18n";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
