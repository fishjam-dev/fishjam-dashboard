import React from "react";
import ReactDOM from "react-dom/client";
import "./css/daisyui.css";
import { ServerSDKProvider } from "./components/ServerSdkContext";
import { Toaster } from "react-hot-toast";
import { RoomsContextProvider } from "./containers/RoomsContext";
import { Drawer } from "./containers/Drawer";
import { ApiProvider } from "./containers/Api";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ServerSDKProvider>
      <RoomsContextProvider>
        <ApiProvider>
          <Toaster />
          <Drawer />
        </ApiProvider>
      </RoomsContextProvider>
    </ServerSDKProvider>
  </React.StrictMode>
);
