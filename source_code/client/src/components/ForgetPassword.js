import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import logo from "../assets/GlobalConnect.png";
import "../styles/ForgetPassword.css";
import axios from "axios";
import Footer from "./Footer";
import Topnav from "./Topnav";
import MainNav from "./MainNav";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/forgot-password", { email });
      toast.success(response.data); 
    } catch (error) {
      console.error("Error:", error.response.data);
      toast.error(error.response.data); 
    }
  };

  return (
    <>
     <Topnav />
      <MainNav />
      <div className="registration-form" style={{ backgroundImage: 'url("./p3.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    <ToastContainer />
     
        <form className="forget-password-form mt-5" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-password-button">Reset Password</button>
          <div className="login-link">
          Remembered your password? <Link to="/login">Login</Link>
        </div>
        </form>
       
</div>
    <Footer/>
    </>
  );
}

export default ForgetPassword;
