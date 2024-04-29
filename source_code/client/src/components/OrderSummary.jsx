import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CheckoutPage.css";
import { loadStripe } from "@stripe/stripe-js";
import { TiArrowLeftThick } from "react-icons/ti";

const stripePromise = loadStripe(
  "pk_test_51OEOecEmpCkUstvcE5dFuey53idyVJAS8l6Je44TLsLQS7ss5SNSBf1qqMmwyg1Fi7KRf28tOf4pvDtuCPxVPLfx00PgVzxC9n"
);

const SHIPPING_DISCOUNT = 200;

export default function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(state ? state.cart : {});

  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(10);
  const [taxPrice, setTaxPrice] = useState(0);

  useEffect(() => {
    let taxPrice = 0.08 * (totalPrice + shippingPrice);
    setTaxPrice(() => taxPrice);
  }, [totalPrice, shippingPrice]);

  useEffect(() => {
    let shipingPrice = 10 + 0.05 * totalPrice;
    setShippingPrice(() => shipingPrice);
  }, [totalPrice]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    try {
      (async () => {
        await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/check-auth");
      })();
    } catch (e) {
      console.log(e);
      alert("session expired");
      navigate("/login");
    }

    (async () => {
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
            axios.get(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/products/${productId}`)
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

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/create-checkout-session",
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

  const getProductPrice = (product) => {
    let price =
      product?.productPrices?.find((v) => v?.size == cart[product._id]?.size)
        ?.price || 0;
    return parseFloat(price)?.toFixed(2);
  };

  const getTotalPrice = () => {
    if (totalPrice >= SHIPPING_DISCOUNT) {
      return (totalPrice + taxPrice).toFixed(2);
    } else {
      return (totalPrice + shippingPrice + taxPrice).toFixed(2);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <button className="back-arrow-btn m-2 mb-0 d-flex align-items-center gap-2" onClick={handleBackClick}>
         <TiArrowLeftThick /> Back
      </button>
      <div
        className="checkout-container"
        style={{
          marginLeft: "0",
          marginRight: "0",
          maxWidth: "100%",
          padding: "2rem 4rem",
          paddingBottom: "0",
        }}
      >
        <h2 className="checkout-heading" style={{ fontWeight: "600" }}>
          Order Summary
        </h2>

        <div
          className="gap-5"
          style={{ marginLeft: "0", marginRight: "0", display: "flex" }}
        >
          <div
            className="scrollable-left-section"
            style={{ overflowY: "auto", flex: "1", height: "36rem" }}
          >
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td
                      onClick={() =>
                        navigate("/user", {
                          state: { selectedProduct: product },
                        })
                      }
                    >
                      <img
                        src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${product.image}`}
                        alt={product.name}
                        style={{
                          width: "5rem",
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <br />
                      {product.name}
                    </td>
                    <td>{cart[product._id]?.size}</td>
                    <td>${getProductPrice(product)}</td>
                    <td>
                      <div className="quantityChange">
                        {cart[product._id]?.quantity}
                      </div>
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
                    <b>Products Price:</b>
                  </td>
                  <td className="total-price">
                    <b>${totalPrice.toFixed(2)}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <section
            className="mt-4 p-4 bg-light rounded"
            style={{ width: "40%", height: "fit-content" }}
          >
            <h2 className="text-lg font-medium text-dark">Order Summary</h2>

            <dl className="mt-4">
              <div className="d-flex justify-content-between">
                <dt className="text-sm text-muted">Subtotal</dt>
                <dd className="text-sm">${totalPrice.toFixed(2)}</dd>
              </div>
              <div className="d-flex justify-content-between border-top border-muted pt-2">
                <dt className="text-sm text-muted">Shipping estimate</dt>
                <dd className="text-sm">${shippingPrice.toFixed(2)}</dd>
              </div>
              {totalPrice >= SHIPPING_DISCOUNT && (
                <div className="d-flex justify-content-between border-top border-muted pt-2">
                  <dt className="text-sm text-muted">Shipping Discount</dt>
                  <dd className="text-sm text-success">
                    $ -{shippingPrice.toFixed(2)}
                  </dd>
                </div>
              )}
              <div className="d-flex justify-content-between border-top border-muted pt-2">
                <dt className="text-sm text-muted">Tax estimate (8%)</dt>
                <dd className="text-sm">${taxPrice.toFixed(2)}</dd>
              </div>

              <div className="d-flex justify-content-between border-top border-muted pt-2">
                <dt className="text-base font-medium">Order total</dt>
                <dd className="text-base font-medium">${getTotalPrice()}</dd>
              </div>
            </dl>
          </section>
        </div>

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
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
}
