import React, { useState } from "react"; 

import { Link, useNavigate } from "react-router-dom"; 

import { useAuth } from "../provider/AuthProvider"; 

import axios from "axios"; 

import logo from "../assets/GlobalConnect.png"; 

import "../styles/Login.css"; 

import { ToastContainer, toast } from "react-toastify"; 

import "react-toastify/dist/ReactToastify.css"; 

 

function Login() { 

  const [username, setUsername] = useState(""); 

  const [password, setPassword] = useState(""); 

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

 

      if (res.data.Role === "Admin") { 

        navigate("/admin"); 

      } else if (res.data.Role === "Seller") { 

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

    <div className="login_container"> 

      <ToastContainer /> 

      <div className="login-box"> 

        <img src={logo} alt="Company Logo" className="login-logo" /> 

        <h2 className="login-heading">Login</h2> 

        <form className="login-form" onSubmit={handleLogin}> 

          <div className="form-group"> 

            <label htmlFor="username" className="form-label"> 

              Username: 

            </label> 

            <input 

              type="text" 

              id="username" 

              className="form-input" 

              value={username} 

              onChange={(e) => setUsername(e.target.value)} 

              required 

            /> 

          </div> 

          <div className="form-group"> 

            <label htmlFor="password" className="form-label"> 

              Password: 

            </label> 

            <input 

              type="password" 

              id="password" 

              className="form-input" 

              value={password} 

              onChange={(e) => setPassword(e.target.value)} 

              required 

            /> 

          </div> 

          <button type="submit" className="login_button"> 

            Login 

          </button> 

        </form> 

        <div className="additional-options"> 

          <p className="register-link"> 

            New user? <Link to="/register"> Register</Link> 

          </p> 

          <p className="forgot-password-link"> 

            <Link to="/forget-password">Forget Password</Link> 

          </p> 

        </div> 

      </div> 

    </div> 

  ); 

} 

 

export default Login; 

 

 