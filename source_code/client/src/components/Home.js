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
import Getfeedback from "./Getfeedback";


function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <div className="login-container">
          <Link to="/login" className="login-button">
            Login
          </Link>
          <Link to="/registers" className="login-button">
            User Register
          </Link>
          <Link to="/feedbacks" className="login-button">
            Feedback
          </Link>
        </div>
      </header>
      <main className="main-content">
        <div className="project-info">
          <h2>
            A bridge connecting Indian small business owners with customers in
            the USA.
          </h2>
        </div>
        <div className="banner-image">
          <img src={require("../assets/banner-image.jpg")} alt="Banner Image" />
        </div>
        <h2>Global Connect is an online store that provides:</h2>
        <div className="categories-section">
          <div className="category">
            <h3>Clothing</h3>
            <p>
              Explore a wide range of traditional dresses and attire from India.
              Discover elegant sarees, vibrant salwar suits, and stylish kurta
              sets that reflect the rich cultural heritage of India. Find the
              perfect outfit for every occasion and express your unique style
              with our exquisite collection.
            </p>
          </div>
          <div className="category">
            <h3>Food</h3>
            <p>
              Indulge in authentic Indian sweets, snacks, and delicacies. From
              mouthwatering gulab jamuns to crispy samosas, experience the
              flavors of India in every bite. Delight your taste buds with our
              diverse selection of traditional dishes and satisfy your cravings
              for authentic Indian cuisine.
            </p>
          </div>
          <div className="category">
            <h3>Supporting Local Businesses</h3>
            <p>
              The platform supports local businesses in the USA, particularly
              those run by individuals on dependent visas who aspire to start
              their ventures. Home bakers and caterers can utilize this platform
              to establish and grow their businesses, offering customers a taste
              of home-cooked goodness.
            </p>
          </div>
        </div>
        <div className="explore-button">
          <button className="explore-products-button">
            Explore More Products
          </button>
        </div>
        <div className="become-seller-section">
          <div className="seller-content">
            <h2>Become a Seller</h2>
            <p>
              Are you a small business owner in India? Join our platform and
              showcase your products to customers in the USA! Start selling your
              traditional dresses, sweets, snacks, and more today.
            </p>
            <p>
              By becoming a seller on Global Connect, you're not just reaching
              customers overseas, but you're also supporting local businesses in
              the USA. We believe in empowering individuals, including those on
              dependent visas, to start and grow their ventures. Our platform
              provides a marketplace for home bakers, caterers, artisans, and
              other entrepreneurs to connect with customers and share their
              unique offerings.
            </p>
            <Link to="/seller-register" className="become-seller-button">Start Selling</Link>
          </div>
        </div>
        <div className="feedback-section">
          <h2>Write to Us</h2>
          <form>
            <textarea
              className="feedback-textarea"
              placeholder="Enter your feedback or suggestions"
            ></textarea>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </main>
      <Getfeedback/>
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
