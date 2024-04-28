import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OrdersList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const ordersRes = await axios.get("http://localhost:8000/user/orders");
        setOrders(ordersRes.data);

        const productIds = ordersRes.data.flatMap((order) =>
          order.productsOrdered.map((product) => product.productID)
        );

        const productPromises = productIds.map((productId) =>
          axios.get(`http://localhost:8000/api/products/${productId}`)
        );

        const productResponses = await Promise.all(productPromises);
        const productsData = productResponses.map(
          (response) => response.data.product
        );
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        toast.error("Error fetching orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleProductClick = (orderId) => {
    setSelectedOrder(orderId);
  };

  return (
    <div className="orders-container">
      <ToastContainer />
      <h2>Orders</h2>
      {selectedOrder ? (
        <>
          <button
            className="back-arrow-btn"
            onClick={() => setSelectedOrder(null)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="product-details">
            {orders.map(
              (order) =>
                order._id === selectedOrder && (
                  <div key={order._id} className="order-item selectedOrder">
                    <div className="products">
                      <ul>
                        <h3>{order.deliveryStatus}</h3>
                        <p>{`Delivery Expected: ${formatDate(
                          order.deliveryDate
                        )}`}</p>
                        <p style={{ color: "red", fontSize: "x-small" }}>
                          {order.comments ? order.comments : ""}
                        </p>
                        {order.productsOrdered.map((product) => {
                          const productDetails = products.find(
                            (p) => p._id === product.productID
                          );
                          return (
                            <li key={product._id} className="product-items">
                              {productDetails && (
                                <>
                                  <img
                                    src={`http://localhost:8000/${productDetails.image}`}
                                    alt={productDetails.name}
                                    className="productImage"
                                    width="100px"
                                  />
                                  <div>
                                    <p>{productDetails.name}</p>
                                    <p>{productDetails.price}</p>
                                    <p>Quantity: {product.orderedQuantity}</p>
                                  </div>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="order-details">
                      <p>{`Order# ${order._id} (${order.productsOrdered.length} Items)`}</p>
                      <p>{`Order placed on ${formatDate(order.orderDate)}`}</p>
                      <p>{`Paid by ${order.payment_method_types}`}</p>
                      <hr />
                      <h3>{`Order Payment Details`}</h3>
                      <hr />
                      <table>
                        <tbody>
                          <tr>
                            <td>Order Amount</td>
                            <td>{`$${order.amount_subtotal / 100}`}</td>
                          </tr>
                          <tr>
                            <td>Order Savings</td>
                            <td>{`$${0}`}</td>
                          </tr>
                          <tr>
                            <td>Coupon savings</td>
                            <td>{`$${0}`}</td>
                          </tr>
                          <tr>
                            <td>Convenience Fee</td>
                            <td>{`$${0}`}</td>
                          </tr>
                          <tr>
                            <td>Order Total</td>
                            <td>{`$${order.amount_subtotal / 100}`}</td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <h4>{`Deliver to`}</h4>
                      <p>
                        <strong>{order.customer_details.name}</strong>
                      </p>
                      <p>
                        {order.customer_details.address.line1}
                        <br />
                        {order.customer_details.address.line2}
                        <br />
                        {order.customer_details.address.city},{" "}
                        {order.customer_details.address.state}
                        <br />
                        {order.customer_details.address.country} -{" "}
                        {order.customer_details.address.postal_code}
                      </p>
                      <p>
                        <strong>{order.customer_details.phone}</strong>
                      </p>
                      <p>
                        <strong>{order.customer_details.email}</strong>
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </>
      ) : (
        <div>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="order-item">
                <p>
                  <strong>Order id:</strong> {order._id}
                </p>
                <div className="products">
                  <ul>
                    {order.productsOrdered.map((product) => {
                      const productDetails = products.find(
                        (p) => p._id === product.productID
                      );
                      return (
                        <li
                          key={product._id}
                          className="product-items"
                          onClick={() => handleProductClick(order._id)}
                        >
                          {productDetails && (
                            <>
                              <img
                                src={`http://localhost:8000/${productDetails.image}`}
                                alt={productDetails.name}
                                className="productImage"
                                width="100px"
                              />
                              <div>
                                <p>{order.deliveryStatus}</p>
                                <p>{`Delivery Expected: ${formatDate(
                                  order.deliveryDate
                                )}`}</p>
                                <p
                                  style={{ color: "red", fontSize: "x-small" }}
                                >
                                  <br />
                                  {order.comments ? order.comments : ""}
                                </p>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <li>No orders found</li>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
