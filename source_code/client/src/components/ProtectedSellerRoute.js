import React from "react";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
function ProtectedSellerRoute() {
  let { role } = useAuth();
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  useEffect(() => {
    (async () => {
      try {
        await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/check-auth");
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

  if (role !== "Seller" && role !== "LocalOwner") {
    return <Navigate to="/login"></Navigate>;
  }
  
  return <Outlet />;
}

export default ProtectedSellerRoute;
