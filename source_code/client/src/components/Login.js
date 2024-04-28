import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../provider/AuthProvider";

import axios from "axios";

import logo from "../assets/GlobalConnect.png";

import "../styles/Login.css";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Topnav from "./Topnav";

import MainNav from "./MainNav";

import Footer from "./Footer";

function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  localStorage.setItem("username", username);

  const { setToken, setRole_ } = useAuth();

  const navigate = useNavigate();

  const notifySuccess = (message) => toast.success(message);

  const notifyError = (message) => toast.error(message);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/login", {
        UserName: username,

        Password: password,
      });

      setRole_(res.data.Role);

      setToken(res.data.token);

      console.log(res.data.UserID);

      localStorage.setItem("userID", res.data.UserID);

      if (res.data.Role === "Admin") {
        navigate("/admin");
      } else if (res.data.Role === "Seller") {
        console.log(res.data.Role);

        navigate("/seller-dashboard");
      } else if (res.data.Role === "LocalOwner") {
        console.log(res.data.Role);

        navigate("/seller-dashboard");
      } else {
        navigate("/user");
      }

      notifySuccess("Login successful.");
    } catch (error) {
      console.error("Login error:", error);

      notifyError("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <Topnav />

      <MainNav />

      <div
        className="registration-form"
        style={{
          backgroundImage: 'url("./p3.webp")',

          backgroundSize: "cover",

          backgroundPosition: "center",

          backgroundRepeat: "no-repeat",
        }}
      >
        <ToastContainer />

        <form onSubmit={handleLogin} className="mt-5">
          <div
            className="register-logo"
            style={{
              width: "100%",

              background: "#7e5888",

              display: "flex",

              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{ widows: "10rem", height: "8rem" }}
            />
          </div>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <span class="label label-default ml-1">Username</span>

            <input
              type="text"
              className="form-control item"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter Your Username"
            />
          </div>

          <div className="form-group">
            <span class="label label-default ml-1">Password</span>

            <input
              type="password"
              className="form-control item"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block create-account"
              style={{ background: "#7e5888" }}
            >
              Login
            </button>
          </div>

          <div className="additional-options">
            <p className="register-link">
              New user? <Link to="/registers"> Register</Link>
            </p>

            <p className="forgot-password-link">
              <Link to="/forget-password">Forget Password</Link>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Login;
