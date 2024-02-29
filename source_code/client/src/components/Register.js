import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import logo from "../assets/GlobalConnect.png";
import "../styles/Register.css";
import axios from "axios";

function Register() {
  const nav = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");

  useEffect(() => {
    if (location.pathname.includes("seller")) {
      setRole("Seller");
    }
  }, [location.pathname]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      return;
    } else {
      try {
        const res = await axios.post("http://localhost:8000/signup", {
          UserName: username,
          Email: email,
          Password: password,
          Role: role, 
        });
        nav("/login", { replace: true });
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src={logo} alt="Company Logo" className="register-logo" />
        <h2 className="register-heading">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;