import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CheckoutPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { TiArrowLeftThick } from "react-icons/ti";

function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(state ? state.cart : {});
  const [totalPrice, setTotalPrice] = useState(0);

  const sendPostRequestCart = async (cart) => {
    let productFlag = true;
    const productsArray = Object.entries(cart).map((p) => {
      if (p[0] === undefined || p[1] === undefined) {
        productFlag = false;
      }
      return { productID: p[0], size: p[1]?.size, quantity: p[1]?.quantity };
    });
    if (productFlag) {
      await axios.post("http://localhost:8000/user/cart", {
        products: productsArray,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    try {
      (async () => {
        await axios.get("http://localhost:8000/check-auth");
      })();
    } catch (e) {
      console.log(e);
      alert("session expired");
      navigate("/login");
    }

    (async () => {
      const cartRes = await axios.get("http://localhost:8000/user/cart");
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
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      navigate("/user");
    } else {
      const fetchProducts = async () => {
        try {
          const productIds = Object.keys(cart);
          const productPromises = productIds.map((productId) =>
            axios.get(`http://localhost:8000/api/products/${productId}`)
          );
          const productResponses = await Promise.all(productPromises);
          const productsData = productResponses.map(
            (response) => response.data.product
          );
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching product details:", error.message);
        }
      };

      fetchProducts();
    }
  }, [cart]);

  useEffect(() => {
    let total = 0;
    products.forEach((product) => {
      total += getProductPrice(product) * cart[product._id]?.quantity;
    });
    setTotalPrice(total);
  }, [products, cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((product) => product._id === productId);
    if (!product) return;

    if (newQuantity > 0 && newQuantity <= product.quantity) {
      const updatedCart = {
        ...cart,
        [productId]: {
          quantity: newQuantity,
          size: cart[product._id]?.size,
        },
      };
      setCart(updatedCart);
      sendPostRequestCart(updatedCart);
    } else if (newQuantity === 0) {
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
      sendPostRequestCart(updatedCart);
    }
  };

  const handleCheckout = () => {
    if (Object.keys(cart).length !== 0) {
      navigate("/order-summary", { state: { cart } });
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

  const handleContinueShopping = () => {
    navigate("/user");
  };

  const getProductPrice = (product) => {
    let price =
      product?.productPrices?.find((v) => v?.size == cart[product._id]?.size)
        ?.price || 0;
    return parseFloat(price)?.toFixed(2);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <button
        className="back-arrow-btn m-2 mb-0 d-flex align-items-center gap-2"
        onClick={handleBackClick}
      >
        <TiArrowLeftThick /> Back
      </button>
      <div className="checkout-container">
        <h2 className="checkout-heading">Checkout</h2>
        <table className="cart-table" style={{ marginBottom: "13rem" }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td
                  onClick={() =>
                    navigate("/user", { state: { selectedProduct: product } })
                  }
                >
                  <img
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.name}
                    className="rounded"
                    style={{
                      width: "5rem",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <br />
                  {product.name}
                </td>
                <td>{cart[product._id]?.size}</td>
                <td>${getProductPrice(product)}</td>
                <td>
                  <div className="quantityChange">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          Math.max(0, cart[product._id]?.quantity - 1)
                        )
                      }
                    >
                      -
                    </button>
                    {cart[product._id]?.quantity}
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          cart[product._id]?.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => handleQuantityChange(product._id, 0)}
                  />
                </td>
                <td>
                  $
                  {(
                    getProductPrice(product) * cart[product._id]?.quantity
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="total-label">
                <b>Total:</b>
              </td>
              <td className="total-price">
                <b>${totalPrice.toFixed(2)}</b>
              </td>
            </tr>
          </tfoot>
        </table>

        <div
          style={{
            position: "sticky",
            bottom: "0",
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "0.5rem",
            padding: "1rem",
            background: "white",
          }}
        >
          <button
            className="continue-shopping-button"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
