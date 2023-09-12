import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
