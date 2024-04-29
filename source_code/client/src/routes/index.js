import React, { useEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgetPassword from "../components/ForgetPassword";
import Home from "../components/Home";
import Logout from "../components/Logout";
import Profile from "../components/Profile";
import SellerDashboard from "../components/SellersDashboard";
import AdminDashboard from "../components/AdminDashboard";
import ResetPassword from "../components/ResetPassword";
import { useNavigateUrl } from "../provider/AuthProvider";

const Routes = () => {
  const { token } = useAuth();
  const role = localStorage.getItem("Role");

  const PublicRoutes = [
    {
      path: "/categories",
      element: <div>Categories Page</div>,
    },
    {
      path: "/about",
      element: <div>About Us</div>,
    },
    {
      path: "/contact",
      element: <div>Contact Us</div>,
    },
  ];

  const RoutesForAuthenticated = [
    {
      path: "/",
      element: <ProtectedRoute component={Home} />,
      children: [
        {
          path: "/",
          element: <Profile />,
        },
        {
          path: "/seller-dashboard",
          element: <SellerDashboard />,
        },
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];
  const RoutesForUserAuthenticated = [
    {
      path: "/",
      element: <ProtectedRoute component={Home} />,
      children: [
        {
          path: "/",
          element: <Profile />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  const RoutesForAdminAuthenticated = [
    {
      path: "/",
      element: <ProtectedRoute component={Home} />,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  const RoutesForSellerAuthenticated = [
    {
      path: "/",
      element: <ProtectedRoute component={Home} />,
      children: [
        {
          path: "/seller-dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  const RoutesForNotAuthenticated = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/seller-register",
      element: <Register />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forget-password",
      element: <ForgetPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ];
  let finalAutheticatedRouter = [];
  switch (role) {
    case "User":
      finalAutheticatedRouter = RoutesForUserAuthenticated;
      break;
    case "Seller":
      finalAutheticatedRouter = RoutesForSellerAuthenticated;
      break;
    case "Admin":
      finalAutheticatedRouter = RoutesForAdminAuthenticated;
      break;
  }
  console.log("test");

  const router = createBrowserRouter([
    ...PublicRoutes,
    {
      path: "/login",
      element: <Login />,
    },
    ...(token ? finalAutheticatedRouter : RoutesForNotAuthenticated),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
