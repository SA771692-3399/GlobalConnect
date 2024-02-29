import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/GlobalConnect.png";
import "../styles/ResetPassword.css";
import axios from "axios";

function ResetPassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("param");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      const response = await axios.post("http://localhost:8000/reset-password", { token, newPassword });
      setMessage(response.data);
    } catch (error) {
      console.error("Error:", error.response.data);
      setMessage(error.response.data);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <img src={logo} alt="Company Logo" className="reset-password-logo" />
        <h2 className="reset-password-heading">Reset Password</h2>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password:</label>
            <input
              type="password"
              id="newPassword"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-password-button">Reset Password</button>
        </form>
        {message && <div className="message">{message}</div>}
        <div className="login-link">
          Remembered your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;