import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./style.css";
import App from "./components/App";
import AppA from "./components/AppA";

const root = createRoot(document.querySelector("#root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);