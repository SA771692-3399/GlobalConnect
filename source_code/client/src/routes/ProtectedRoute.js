import { Outlet, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../provider/AuthProvider";

export const ProtectedRoute = function () {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login"></Navigate>;
  }

  return <Outlet />;
};
