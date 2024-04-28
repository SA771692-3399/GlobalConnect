import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/GlobalConnect.png";
import axios from "axios";
import "../styles/Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import ProfilePage from "./ProfilePage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrdersList from "./OrdersList";

function Profile() {
  const [products, setProducts] = useState([]);
  const [displayOrdersList, setDisplayOrdersList] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [details, setDetails] = useState({});
  const [displayProfilePage, setDisplayProfilePage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        try {
          await axios.get("http://localhost:8000/check-auth");
        } catch (e) {
          console.log(e);
          alert("session expired");
          navigate("/login");
        }

        const userDetailsRes = await axios.get(
          "http://localhost:8000/api/userDetails"
        );
        setDetails(userDetailsRes.data.User);

        const productsRes = await axios.get(
          "http://localhost:8000/api/products"
        );
        setProducts(productsRes.data.products);

        // const fakeStoreProductsRes = await axios.get(
        //   "https://fakestoreapi.com/products"
        // );
        // const fakeStoreProducts = fakeStoreProductsRes.data;
        // setProducts((prevProducts) => [...prevProducts, ...fakeStoreProducts]);

        const cartRes = await axios.get("http://localhost:8000/user/cart");
        if (cartRes.data.products) {
          const prodJSON = {};
          cartRes.data.products.forEach((c) => {
            prodJSON[c.productID] = c.quantity;
          });
          setCart(prodJSON);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
    let sessionID = searchParams.get("session_id");
    if (sessionID) {
      (async () => {
        const res = await axios.get(
          `http://localhost:8000/user/session-status?session_id=${sessionID}`
        );

        if (res.data.status === "open") {
          navigate("/checkout");
        }

        if (res.data.status === "complete") {
          await axios.delete("http://localhost:8000/user/cart");
          searchParams.delete("session_id");
          setSearchParams(searchParams);
          alert(
            `We appreciate your business! A confirmation email will be sent to ${res.data.customer_email}. If you have any questions, please email to us.`
          ); 
        }
      })();
    }
  }, []);

  const sendPostRequestCart = async (cart) => {
    let productFlag = true;
    const productsArray = Object.entries(cart).map((p) => {
      if (p[0] === undefined || p[1] === undefined) {
        productFlag = false;
      }
      return { productID: p[0], quantity: p[1] };
    });
    if (productFlag) {
      await axios.post("http://localhost:8000/user/cart", {
        products: productsArray,
      });
    }
  };
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    setDisplayProfilePage(!displayProfilePage);
    setDisplayOrdersList(false);
  };

  const handleOrdersClick = () => {
    setDisplayOrdersList(!displayOrdersList);
    setDisplayProfilePage(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setDisplayOrdersList(false);
    setDisplayProfilePage(false);
    if (!selectedProduct) {
      setSelectedProduct(product);
    }
  };

  const addToCart = async (productId, productName) => {
    if (cart[productId]) {
      toast.error(`${productName} is already in the cart!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        updatedCart[productId] = (updatedCart[productId] || 0) + 1;
        sendPostRequestCart(updatedCart);
        return updatedCart;
      });

      toast.success(`${productName} added to cart!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const getTotalItemsInCart = () => {
    return Object.keys(cart).length;
  };

  const handleCartClick = () => {
    if (Object.keys(cart).length !== 0) {
      navigate("/checkout", { state: { cart } });
    } else {
      toast.error(`cart is empty. Add some item to proceed`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="profile-container">
      <header className="profile-header">
      <div className="logo-container">
        <Link className="logo-link" onClick={() => {
          setDisplayOrdersList(false);
          setDisplayProfilePage(false);
        }}>
          <img src={logo} alt="Company Logo" className="logo" />
        </Link>
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
                  <Link className="dropdown-item" onClick={handleOrdersClick}>
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
          <div className="cart-info" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingCart} />
            <div className="cart-count"> {getTotalItemsInCart()}</div>
          </div>
        </div>
      </header>
      <ToastContainer />
      {displayOrdersList ? (
      <OrdersList />
      ) : displayProfilePage ? (
       <ProfilePage />
        ) :  (
        <div className="main-container">
          {!selectedProduct && (
            <div className="sidebar">
              <h2>Categories</h2>
              <ul className="category-list">
                <li>
                  <Link onClick={() => handleCategoryClick("")}>All</Link>
                </li>
                <li>
                  <Link onClick={() => handleCategoryClick("Clothing")}>
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link onClick={() => handleCategoryClick("Food")}>Food</Link>
                </li>
                <li>
                  <Link onClick={() => handleCategoryClick("Local business")}>
                    Local Business
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="products">
            {selectedProduct ? (
              <>
                <button
                  className="back-arrow-btn"
                  onClick={handleBackToProducts}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <br></br>
                <div className="product-details">
                  <h2>
                    {selectedProduct.name
                      ? selectedProduct.name
                      : selectedProduct.title}
                  </h2>
                  <div className="selected-product-card">
                    <img
                      src={
                        selectedProduct.name
                          ? `http://localhost:8000/${selectedProduct.image}`
                          : selectedProduct.image
                      }
                      alt={selectedProduct.name}
                      className="selected-product-image"
                    />
                    <div className="selected-product-details">
                      <p>Description: {selectedProduct.description}</p>
                      <p>
                        <b>Price: ${selectedProduct.price}</b>
                      </p>
                      <div className="selected-product-buttons">
                        <button
                          className="add-to-cart-btn"
                          onClick={() =>
                            selectedProduct.quantity && selectedProduct.quantity !== 0 ? addToCart(selectedProduct._id, selectedProduct.name): null
                          }
                        >
                          {selectedProduct.quantity && selectedProduct.quantity !== 0 ? "Add to Cart" : "out of stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <React.Fragment>
                <h2>Products</h2>
                <div className="product-list">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id ? product._id : product.id}
                      className="product-item"
                      id={product.quantity && product.quantity !== 0 ? "in-stock" : "out-of-stock"}
                    >
                      <div className="product-card">
                        <img
                          src={
                            product._id
                              ? `http://localhost:8000/${product.image}`
                              : product.image
                          }
                          alt={product.name}
                          className="product-image"
                          onClick={() => handleProductClick(product)}
                        />
                        <div className="product-details">
                          <h3
                            className="product-name"
                            onClick={() => handleProductClick(product)}
                          >
                            {product.name ? product.name : product.title}
                          </h3>
                          <p className="product-price">Price: ${product.price}</p>
                          <br />
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(product._id, product.name)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      {!product.quantity || product.quantity === 0 ? (
                          <p className="overlay-text">Out Of Stock</p>
                        ) : null}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;


