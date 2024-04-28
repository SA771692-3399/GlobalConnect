import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CheckoutPage.css";
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const stripePromise = loadStripe(
  "pk_test_51OEOecEmpCkUstvcE5dFuey53idyVJAS8l6Je44TLsLQS7ss5SNSBf1qqMmwyg1Fi7KRf28tOf4pvDtuCPxVPLfx00PgVzxC9n"
);

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
      return { productID: p[0], quantity: p[1] };
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
          prodJSON[c.productID] = c.quantity;
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
      total += product.price * cart[product._id];
    });
    setTotalPrice(total);
  }, [products, cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((product) => product._id === productId);
    if (!product) return;

    if (newQuantity > 0 && newQuantity <= product.quantity) {
      const updatedCart = { ...cart, [productId]: newQuantity };
      setCart(updatedCart);
      sendPostRequestCart(updatedCart);
    } else if (newQuantity === 0) {
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
      sendPostRequestCart(updatedCart);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/user/create-checkout-session",
        {
          cart,
        }
      );
      const { sessionId } = response.data;
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const handleContinueShopping = () => {
    navigate("/user");
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
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
                  className="product-image"
                  width="100px"
                />
                <br />
                {product.name}
              </td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <div className="quantityChange">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        Math.max(0, cart[product._id] - 1)
                      )
                    }
                  >
                    -
                  </button>
                  {cart[product._id]}
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, cart[product._id] + 1)
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
              <td>${(product.price * cart[product._id]).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="total-label">
              <b>Total:</b>
            </td>
            <td className="total-price">
              <b>${totalPrice.toFixed(2)}</b>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="buttons">
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
  );
}

export default CheckoutPage;
