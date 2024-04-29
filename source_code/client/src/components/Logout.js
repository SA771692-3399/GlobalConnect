import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

function Logout() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      navigate("/", { replace: true });
      setToken();

      localStorage.clear();
      window.location.href = "/";
    };
    logout(); 
  }, []);

  return <></>; 
}

export default Logout;
