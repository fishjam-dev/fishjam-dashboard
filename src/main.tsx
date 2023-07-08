import React from "react";
import ReactDOM from "react-dom/client";
import "./css/daisyui.css";
import { ServerSDKProvider } from "./components/ServerSdkContext";
import { Toaster } from "react-hot-toast";
import App2 from "./containers/App2";
import { RoomsContextProvider } from "./containers/RoomsContext";
// import App1 from "./containers/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ServerSDKProvider>
      <RoomsContextProvider>
        <Toaster />
        <App2 />
      </RoomsContextProvider>
      {/*<App1 />*/}
    </ServerSDKProvider>
  </React.StrictMode>
);
