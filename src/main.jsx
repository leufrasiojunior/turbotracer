import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/Styles/style.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./Routes/Login.jsx";
import Dashboard from "./Routes/Dashboard.jsx";
import List from "./Routes/List.jsx";
import Home from "./Routes/Home.jsx";
import Layout from "./Components/Layout.jsx";
import ProtectedRoute from "./middlewares/ProtectedRoute.jsx";
import Settings from "./Routes/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/results",
        element: (
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
