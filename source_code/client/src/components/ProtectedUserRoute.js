import React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
function ProtectedUserRoute() {
  let { role } = useAuth();
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  useEffect(() => {
    (async () => {
      try {
        await axios.get("http://localhost:8000/check-auth");
      } catch (e) {
        console.log(e);
        alert("session expired");
        nav("/login");
      }
    })();
  }, []);
  if (role === "") {
    role = localStorage.getItem("Role");
  }

  if (role !== "User") {
    return <Navigate to="/login"></Navigate>;
  }
  return <Outlet />;
}

export default ProtectedUserRoute;
