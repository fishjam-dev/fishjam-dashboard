import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./containers/Dashboard";
import { WebrtcInternalsPage } from "./internals/WebRTCInternals";
import Page404 from "./Page404";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/servers/:host/internals" element={<WebrtcInternalsPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
