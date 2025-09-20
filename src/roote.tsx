import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import MessagePage from "./components/Message";
import Home from "./components/Home";
import DriverChat from "./components/DiverChat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <MessagePage />,
      },
      {
        path: "/driver-chat",
        element: <DriverChat />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
