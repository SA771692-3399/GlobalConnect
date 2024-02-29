import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import logo from "../assets/GlobalConnect.png";

import axios from "axios";

import "../styles/Profile.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import ProfilePage from "./ProfilePage";

function Profile() {
  const [products, setProducts] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [details, setDetails] = useState({});

  const [displayProfilePage, setDisplayProfilePage] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("No token found");

        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const userDetailsRes = await axios.get(
          `http://localhost:8000/api/userDetails`
        );

        setDetails(userDetailsRes.data.User);

        const productsRes = await axios.get(
          `http://localhost:8000/api/products`
        );

        setProducts(productsRes.data.products);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    setDisplayProfilePage(!displayProfilePage);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;

    setSearchQuery(query);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/products?q=${query}`
      );

      setSearchResults(res.data.products);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Perform search functionality

    console.log("Searching for:", searchQuery);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Function to handle product card click

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Filter products based on the selected category

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>

        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="search-input"
            />

            <button type="submit" className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          {searchQuery && (
            <div className="search-results">
              {searchResults.map((product) => (
                <div key={product._id} className="search-result-item">
                  <Link
                    to={`/product/${product._id}`}
                    className="search-result-link"
                  >
                    {product.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-container">
          <div className="user-info">
            {details && <span>Welcome, {details.UserName}</span>}
          </div>

          <div className="user-options">
            <div className="dropdown">
              <button
                className="dropdown-toggle"
                onClick={handleDropdownToggle}
              >
                My Account
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link className="dropdown-item" onClick={handleProfileClick}>
                    Profile
                  </Link>

                  <Link to="/orders" className="dropdown-item">
                    Orders
                  </Link>

                  <Link to="/wishlist" className="dropdown-item">
                    Wishlist
                  </Link>

                  <Link to="/logout" className="dropdown-item">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="cart-info">
            <Link to="/cart">Cart (0)</Link>
          </div>
        </div>
      </header>

      {displayProfilePage ? <ProfilePage /> : <div></div>}
    </div>
  );
}

export default Profile;
