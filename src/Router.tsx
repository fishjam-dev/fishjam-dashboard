import { createBrowserRouter } from "react-router-dom";
import Page404 from "./Page404";
import { Dashboard } from "./containers/Dashboard";
import { WebrtcInternalsPage } from "./internals/WebRTCInternals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/internals/:host",
    element: <WebrtcInternalsPage />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);
