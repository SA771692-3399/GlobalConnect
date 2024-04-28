import { useMemo, useContext, useEffect, useState, createContext } from "react";

import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setTokenPrivate] = useState(localStorage.getItem("token"));
  const [role, setRole_] = useState("");
  const setToken = (newToken) => {
    setTokenPrivate(newToken);
  };
  const setRole = async () => {
    try {
      const res = await axios.get("http://localhost:8000/check-auth");
      localStorage.setItem("Role", res.data.role);
      setRole_(res.data.role);
    } catch (e) {
      console.log(e);
    }
  };
  const removeRole = async () => {
    localStorage.removeItem("Role");
    setRole_("");
  };
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setRole();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      removeRole();
    }
  }, [token]);

  const contextVal = useMemo(
    () => ({
      token,
      setToken,
      role,
      setRole_,
    }),
    [token]
  );
  return (
    <AuthContext.Provider value={contextVal}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
