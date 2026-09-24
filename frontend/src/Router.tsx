import { createBrowserRouter } from "react-router";
import App from "./App";
import RoomComponent from "./components/Room";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/room/:roomId",
    element: <RoomComponent />,
  },
]);

export default router;
