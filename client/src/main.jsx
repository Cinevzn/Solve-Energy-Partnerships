import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { initTrackingFromUrl } from "./lib/tracking.js";
import { initMetaPixel } from "./lib/metaPixel.js";
import "./styles/global.css";

initTrackingFromUrl();
initMetaPixel();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
