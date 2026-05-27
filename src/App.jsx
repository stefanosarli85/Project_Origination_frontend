import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import ReportsPage from "./components/UI/ReportsPage";
import ItalyReportsPage from "./components/UI/ItalyReportsPage";
import SelectedCompanies from "./components/UI/SelectedCompanies";

import ForgotPassword from "./pages/ForgotPassword";
import NotFoundPage from "./pages/NotFoundPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";

import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/selected-companies",
      element: <SelectedCompanies />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },

    // India Reports Page
    {
      path: "/reports",
      element: <ReportsPage />,
    },

    // Italy Reports Page
    {
      path: "/italy-reports",
      element: <ItalyReportsPage />,
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;