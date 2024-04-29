import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OrdersList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const ordersRes = await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/orders");
        setOrders(ordersRes.data);

        // const productIds = ordersRes.data.flatMap(
        //   (order) => order.productsOrdered.map((product) => product.productID)
        // );

        // const productPromises = productIds.map((productId) =>
        //   axios.get(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/products/${productId}`)
        // );

        // const productResponses = await Promise.all(productPromises);
        // const productsData = productResponses.map((response) => response.data.product);
        // setProducts(productsData);
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
          <button className="back-arrow-btn" onClick={() => setSelectedOrder(null)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="product-details">
            {orders.map((order) =>
              order._id === selectedOrder && (
                <div key={order._id} className="order-item selectedOrder">
                  <div className="mt-3 pt-3">
                    <ul style={{width: "100%"}}>
                      <h3>{order.deliveryStatus}</h3>
                      <p>{`Delivery Expected: ${formatDate(order.deliveryDate)}`}</p>
                      <p >
                        Comments: {order.comments ? order.comments : ""}
                      </p>

                      <div className="d-flex flex-wrap gap-3">                        
                        {order.productsOrdered.map((product, i) => (
                            <li key={i} className="product-items" style={{width: "25rem"}}>
                            <img
                              src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${product.image}`}
                              alt={product.productName}
                              className="productImage"
                              width="100px"
                              style={{
                                objectFit: "contain",
                              }}
                            />
                            <div>
                              <p>{product.productName}</p>
                              <p>Price: ${product.productPrice}</p>
                              <p>Size: {product.orderedSize}</p>
                              <p>Quantity: {product.orderedQuantity}</p>
                              <p>Status: {order?.status ?? product?.productDeliveryStatus}</p>

                              <button
                                className="add-to-cart-btn ml-3"
                                onClick={() => navigate(`/Productfb/${product.productID}`)}
                              >
                                Rate this product
                              </button>
                            </div>
                      </li>
                        ))}
                      </div>
                    </ul>
                  </div>
                  <div className="order-details">
                  <p>{`Tracking ID: TID${order._id.substring(order._id.length - 8)}`}</p>
                 
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
                          <td>${order?.productsPrice?.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Shipping Charges</td>
                          <td>${order?.shippingCharges?.toFixed(2)}</td>
                        </tr>
                        {order?.shippingDiscount ? (
                          <tr>
                            <td>Shipping Discount</td>
                            <td className="text-success">-${order?.shippingDiscount?.toFixed(2)}</td>
                          </tr>
                        ) : null}
                        <tr>
                          <td>Tax Charges</td>
                          <td>${order?.taxCharges?.toFixed(2)}</td>
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
                      {order.customer_details.address.city}, {order.customer_details.address.state}
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
        <div className="d-flex flex-wrap">
          {orders && orders.length > 0 ? (
            orders.map((order, i) => (
              <div key={i} className="card" style={{width: "30rem"}} onClick={() => handleProductClick(order._id)}>
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p className="card-text">Delivery Status: {order.deliveryStatus}</p>
                  <p className="card-text">Delivery Expected: {formatDate(order.deliveryDate)}</p>
                </div>
                <ul className="list-group list-group-flush flex-grow-1">
                  {order?.productsOrdered?.map((o, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <img src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${o?.image}`} alt={o?.name} className="rounded" style={{ objectFit: "contain", width: "3rem" }} />
                      <div>{`${o?.productName} (${o?.orderedSize})`}</div>
                      <div>Qty:{o?.orderedQuantity}</div>
                      <div>${o?.productPrice}</div>
                    </li>
                  ))}
                </ul>
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
