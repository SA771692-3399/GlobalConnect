import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/GlobalConnect.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        {/* <nav className="menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav> */}
        <div className="login-container">
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </header>


    





      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>About Us</h2>
              <p>Global Connect bridges Indian small business owners with USA customers, offering traditional products like clothing, food, and handicrafts. We empower entrepreneurs, foster cultural exchange, and promote economic opportunities.</p>
          </div>      
          <div className="footer-section">
            <h2>Contact Us</h2>
            <p>Email: info@example.com</p>
            <p>Phone: +1234567890</p>
          </div>
          <div className="footer-section">
            <h2>Follow Us</h2>
            <div className="social-icons">
              <a href="#">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <img src={logo} alt="Company Logo" className="footer-logo" />
          <p>&copy; 2024 Global Connect. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;