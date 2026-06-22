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
import LandingPage from "./pages/LandingPage";
import KycCheck from "./pages/KycCheck";
import PersonKyc from "./pages/PersonKyc";
import CompanyKyc from "./pages/CompanyKyc";
import KycResult from "./pages/KycResult";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyKycResult from "./pages/CompanyKycResult";
import CompanyNews from "./pages/CompanyNews";
import KycRegionSelect from "./pages/KycRegionSelect";
import KycRegionSelection from "./pages/KycRegionSelection";
import ItalyCompanyKyc from "./pages/ItalyCompanyKyc";
import ItalyPersonKyc from "./pages/ItalyPersonKyc";



function App() {
  const router = createBrowserRouter([
    {
  path: "/",
  element: <LandingPage />,
},
{
  path: "/search-companies",
  element: <Home />,
},

{
  path: "/kyc-check",
  element: <KycCheck />,
},
{
  path: "/kyc-person",
  element: <PersonKyc />,
},
{
  path: "/kyc-company",
  element: <CompanyKyc />,
},
{
  path: "/company-kyc-result",
  element: <CompanyKycResult />,
},
{
  path: "/company-news",
  element: <CompanyNews />,
},
{
  path: "/kyc-region",
  element: <KycRegionSelection />,
},
{
  path: "/kyc-region-select",
  element: <KycRegionSelect />,
},

    {
      path: "/selected-companies",
      element: <SelectedCompanies />,
    },
    {
  path: "/italy-person-kyc",
  element: <ItalyPersonKyc />,
},
{
  path: "/italy-company-kyc",
  element: <ItalyCompanyKyc />,
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

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
      />
    </>
  );
}

export default App;