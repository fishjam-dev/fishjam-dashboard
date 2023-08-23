import React from "react";
import ReactDOM from "react-dom/client";
import "./css/daisyui.css";
import { Drawer } from "./containers/Drawer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Drawer />
  </React.StrictMode>,
);
