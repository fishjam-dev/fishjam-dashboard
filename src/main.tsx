import React from "react";
import ReactDOM from "react-dom/client";
import "./css/daisyui.css";
import { App } from "./containers/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
