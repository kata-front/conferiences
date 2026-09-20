import { createBrowserRouter } from "react-router";
import App from "./App";
import RoomComponent from "./components/Room";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/room/:id",
    element: <RoomComponent />,
  },
]);

export default router;
