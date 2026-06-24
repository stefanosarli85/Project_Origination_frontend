import { createBrowserRouter } from "react-router";

import { RouterProvider } from "react-router/dom";
 
import ReportsPage from "./components/UI/ReportsPage";

import ItalyReportsPage from "./components/UI/ItalyReportsPage";

import SelectedCompanies from "./components/UI/SelectedCompanies";
 
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

import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
 
const router = createBrowserRouter([

  {

    path: "/",

    element: <PublicRoute><SignUp /></PublicRoute>,

  },

  {

    path: "/login",

    element: <PublicRoute><Login /></PublicRoute>,

  },

  {

    path: "/signup",

    element: <PublicRoute><SignUp /></PublicRoute>,

  },

  {

    path: "/landing",

    element: <ProtectedRoute><LandingPage /></ProtectedRoute>,

  },

  {

    path: "/search-companies",

    element: <ProtectedRoute><Home /></ProtectedRoute>,

  },

  {

    path: "/kyc-check",

    element: <ProtectedRoute><KycCheck /></ProtectedRoute>,

  },

  {

    path: "/kyc-person",

    element: <ProtectedRoute><PersonKyc /></ProtectedRoute>,

  },

  {

    path: "/kyc-company",

    element: <ProtectedRoute><CompanyKyc /></ProtectedRoute>,

  },

  {

    path: "/company-kyc-result",

    element: <ProtectedRoute><CompanyKycResult /></ProtectedRoute>,

  },

  {

    path: "/company-news",

    element: <ProtectedRoute><CompanyNews /></ProtectedRoute>,

  },

  {

    path: "/kyc-region",

    element: <ProtectedRoute><KycRegionSelection /></ProtectedRoute>,

  },

  {

    path: "/kyc-region-select",

    element: <ProtectedRoute><KycRegionSelect /></ProtectedRoute>,

  },

  {

    path: "/selected-companies",

    element: <ProtectedRoute><SelectedCompanies /></ProtectedRoute>,

  },

  {

    path: "/italy-person-kyc",

    element: <ProtectedRoute><ItalyPersonKyc /></ProtectedRoute>,

  },

  {

    path: "/italy-company-kyc",

    element: <ProtectedRoute><ItalyCompanyKyc /></ProtectedRoute>,

  },

  {

    path: "/kyc-result",

    element: <ProtectedRoute><KycResult /></ProtectedRoute>,

  },

  {

    path: "/reports",

    element: <ProtectedRoute><ReportsPage /></ProtectedRoute>,

  },

  {

    path: "/italy-reports",

    element: <ProtectedRoute><ItalyReportsPage /></ProtectedRoute>,

  },

  {

    path: "*",

    element: <NotFoundPage />,

  },

]);
 
function App() {

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
 