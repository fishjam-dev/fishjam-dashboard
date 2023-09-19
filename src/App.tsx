import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./containers/Dashboard";
import { WebrtcInternalsPage } from "./internals/WebRTCInternals";
import Page404 from "./Page404";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/jellyfish-dashboard" element={<Dashboard />} />
        <Route path="/jellyfish-dashboard/servers/:host/internals" element={<WebrtcInternalsPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
