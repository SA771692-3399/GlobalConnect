import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/GlobalConnect.png";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript

import "../styles/Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import ProfilePage from "./ProfilePage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrdersList from "./OrdersList";
import LocalCata from "./LocalCata";
import UserD from "./UserD";
import ProductDes from "./ProductDes";
import WishList from "./WishList";
import { RiMenuFill } from "react-icons/ri";

function Profile() {
  const [products, setProducts] = useState([]);
  const [displayOrdersList, setDisplayOrdersList] = useState(false);
  const [details, setDetails] = useState({});
  const [displayProfilePage, setDisplayProfilePage] = useState(false);
  const [displayWishPage, setDisplayWishPage] = useState(false);
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
          await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/check-auth");
        } catch (e) {
          console.log(e);
          alert("session expired");
          navigate("/login");
        }

        const userDetailsRes = await axios.get(
          "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/userDetails"
        );
        setDetails(userDetailsRes.data.User);

        const productsRes = await axios.get(
          "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/products"
        );
        setProducts(productsRes.data.products);

        const cartRes = await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/cart");
        if (cartRes.data.products) {
          const prodJSON = {};
          cartRes.data.products.forEach((c) => {
            prodJSON[c.productID] = {
              quantity: c.quantity,
              size: c.size,
            };
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
          `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/session-status?session_id=${sessionID}`
        );

        if (res.data.status === "open") {
          navigate("/checkout");
        }

        if (res.data.status === "complete") {
          alert(
            `We appreciate your business! A confirmation email will be sent to ${res.data.customer_email}. If you have any questions, please email to us.`
          );
          await axios.delete("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/cart");
          searchParams.delete("session_id");
          setSearchParams(searchParams);
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
      return { productID: p[0], size: p[1]?.size, quantity: p[1]?.quantity };
    });
    if (productFlag) {
      await axios.post("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/cart", {
        products: productsArray,
      });
    }
  };

  const handleProfileClick = () => {
    setDisplayProfilePage(!displayProfilePage);
    setDisplayOrdersList(false);
  };

  const handleOrdersClick = () => {
    setDisplayOrdersList(!displayOrdersList);
    setDisplayProfilePage(false);
  };

  const handleWishClick = () => {
    setDisplayWishPage(!displayWishPage);
    setDisplayProfilePage(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("Selected product category:", category); // Assuming category has a 'name' property
    if (category === "Local business") {
      // Redirect or render LocalCata component here
      return <LocalCata />;
    }
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

  const addToCart = async (productId, productName, size) => {
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
        updatedCart[productId] = {
          size: size,
          quantity: (updatedCart?.[productId]?.quantity || 0) + 1
        };
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
  const handleDashboardClick = () => {
    // Refresh the page
    window.location.reload();
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleOutsideClick = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);
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

  const addToWishList = async (productId, productName) => {
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

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleOutsideClick = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="logo-container">
          <Link
            className="logo-link"
            onClick={() => {
              setDisplayOrdersList(false);
              setDisplayProfilePage(false);
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{
                width: "6rem",
                marginTop: "-1rem",
                marginBottom: "-1rem",
              }}
            />
          </Link>
        </div>

        <div>
          <div className="cart-info" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingCart} />
            <div className="cart-count"> {getTotalItemsInCart()}</div>
          </div>
        </div>

        <div className="user-options">
          <div className="dropdown" onClick={toggleDropdown}>
            <button
              className="btn btn-secondary dropdown-toggle d-flex align-items-center gap-2 border"
              type="button"
              id="dropdownMenuButton"
              aria-haspopup="true"
              aria-expanded={dropdownOpen ? "true" : "false"}
            >
              <RiMenuFill />
              Home
            </button>
            <div
              className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
              aria-labelledby="dropdownMenuButton"
            >
            <Link className="dropdown-item" onClick={handleDashboardClick}>
        Dashboard
      </Link>
              <Link className="dropdown-item" onClick={handleProfileClick}>
                Profile
              </Link>
              <Link className="dropdown-item" onClick={handleOrdersClick}>
                Orders
              </Link>
              <Link className="dropdown-item" onClick={handleWishClick}>
                Wishlist
              </Link>
              <Link to="/logout" className="dropdown-item">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>
      <ToastContainer />
      {displayOrdersList ? (
        <OrdersList />
      ) : displayProfilePage ? (
        <ProfilePage />
      ) : displayWishPage ? (
        <WishList addToCart={addToCart} />
      ) : (
        <div
          className="main-container"
          style={{
            height: "20rem",
            margin: "0",
            padding: "0",
            marginTop: "-1.5rem",
          }}
        >
          {!selectedProduct && (
            <header>
              <nav
                id="sidebarMenu"
                class="collapse d-lg-block sidebar collapse bg-white"
              >
                <div class="position-sticky">
                  <div class="list-group list-group-flush mx-3 mt-4">
                    <ul className="category-list">
                      <li>
                        <Link
                          onClick={() => handleCategoryClick("")}
                          class="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => handleCategoryClick("Clothing")}
                          class="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          Clothing
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => handleCategoryClick("Food")}
                          class="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          Food
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => handleCategoryClick("Local business")}
                          class="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          Local Business
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </header>
          )}

          <div className="products">
            {selectedProduct ? (
              <div div style={{ background: "white" }}>
                <ProductDes
                  handleBackToProducts={handleBackToProducts}
                  selectedProduct={selectedProduct}
                  addToCart={addToCart}
                  selectedCategory={selectedCategory}
                  filteredProducts={filteredProducts}
                  handleProductClick={handleProductClick}
                  addToWishList={addToWishList}
                />
              </div>
            ) : (
              <React.Fragment>
                <div>
                  {selectedCategory !== "Local business" ? (
                    <UserD
                      selectedCategory={selectedCategory}
                      filteredProducts={filteredProducts}
                      handleProductClick={handleProductClick}
                      addToCart={addToCart}
                      addToWishList={addToWishList}
                    />
                  ) : (
                    <div>
                      <LocalCata
                        filteredProducts={filteredProducts}
                        handleProductClick={handleProductClick}
                        addToCart={addToCart}
                      />
                    </div>
                  )}
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
