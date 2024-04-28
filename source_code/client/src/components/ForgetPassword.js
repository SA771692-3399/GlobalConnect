import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/GlobalConnect.png";
import "../styles/ForgetPassword.css";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="forget-password-container">
      <ToastContainer />
      <div className="forget-password-box">
        <img src={logo} alt="Company Logo" className="forget-password-logo" />
        <h2 className="forget-password-heading">Forget Password</h2>
        <form className="forget-password-form" onSubmit={handleSubmit}>
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
              required
            />
          </div>
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
        <div className="login-link">
          Remembered your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
