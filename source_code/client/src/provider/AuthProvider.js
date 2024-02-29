import { useMemo, useContext, useEffect, useState, createContext } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setTokenPrivate] = useState(localStorage.getItem("token"));
  const setToken = (newToken) => {
    setTokenPrivate(newToken);
  };
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextVal = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );
  return (
    <AuthContext.Provider value={contextVal}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
