import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faHome,
 faBoxOpen,
 faUser,
 faSignOutAlt,
 faPlus,
 faCog,
 faEdit,
 faTrashAlt,
 faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/GlobalConnect.png";
import "../styles/SellerDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stripe from "stripe";
 
const stripe = new Stripe("sk_test_51OEOecEmpCkUstvcPQN6Ac99kxpeelJoqhc9tbXLxOX1bjSaSs4CSmtg7f8ZvQVQh0gm4pBMrjp3zjcXCdwHB3NB004n5h91oQ");
 
function SellerDashboard() {
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [activeTab, setActiveTab] = useState("dashboard");
 const [orders, setOrders] = useState([]);
 const [products, setProducts] = useState([]);
 const [details, setDetails] = useState({});
 const [formData, setFormData] = useState({
   id: "",
   name: "",
   price: "",
   description: "",
   quantity: "",
   image: null,
   category: "",
 });
 const [editingProduct, setEditingProduct] = useState(null);
 const notifySuccess = (message) => toast.success(message);
 const notifyError = (message) => toast.error(message);
 const nav = useNavigate();
const [editingOrder, setEditingOrder] = useState(null);
const [orderStatus, setOrderStatus] = useState('');
const [orderComments, setOrderComments] = useState('');
const orderStatusOptions = [
 "Order placed",
 "Order confirmed",
 "Order processing",
 "Order Shipped",
 "Canceled",
 
];
 
const handleActiveTab = (tabName) => {
 setActiveTab(tabName);
 if (tabName === "addProduct") {
   setFormData({
     id: "",
     name: "",
     price: "",
     description: "",
     quantity: "",
     image: null,
     category: "",
   });
   setEditingProduct(null);
 }
};
 
const handleSaveOrderStatus = async (orderId) => {
 try {
   const token = localStorage.getItem("token");
   if (!token) throw new Error("No token found");
 
   axios.defaults.headers.common["Authorization"] = "Bearer " + token;
   if(!orderComments && orderComments === "")
   {
     setOrderComments("Updated by Seller");
   }
 
   await axios.patch(`http://localhost:8000/seller/orders/${orderId}`, {
     deliveryStatus: orderStatus,
     comments: orderComments
   });
 
   if(orderStatus === "Canceled"){
     const order = orders.find((order) => order._id === orderId);
     const paymentIntentId = order.payment_intent;
     const refund = await stripe.refunds.create({
       payment_intent: paymentIntentId,
     });
     if(refund){
       await axios.patch(`http://localhost:8000/seller/orders/${orderId}`, {
        deliveryStatus: "Refunded",
        comments: orderComments
      });
     }
     notifySuccess("Refund successful:", refund);
   }
 
   setOrders(orders.map(order => order._id === orderId ? { ...order, deliveryStatus: orderStatus,comments:orderComments } : order));
   setEditingOrder(null);
   notifySuccess("Order status updated successfully");
 } catch (error) {
   console.error("Error updating order status:", error.message);
   notifyError("Failed to update order status");
 }
};
 

const handleEditOrderStatus = (orderId) => {
 setEditingOrder(orderId);
};
 
 useEffect(() => {
   fetchData();
   initializeFormData();
 }, []);
 
 const initializeFormData = () => {
 
   setFormData({
     username: details.UserName,
     email: details.Email,
     phoneNumber: details.PhoneNumber || "",
     address: details.Address || "",
     password: "",
     newPassword: "",
   });
 };
 
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
       nav("/login");
     }
 
     const userDetailsRes = await axios.get(
       "http://localhost:8000/api/userDetails"
     );
     setDetails(userDetailsRes.data.User);
 
     const productsRes = await axios.get("http://localhost:8000/seller/products");
     setProducts(productsRes.data.products);
 
     const ordersRes = await axios.get("http://localhost:8000/seller/orders");
     setOrders(ordersRes.data.orders);
 
   } catch (error) {
     console.error("Error fetching data:", error.message);
     notifyError("Failed to fetch data");
   }
 };}
 case "orders":
    return (
      <div className="orders-container">
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
                  <div className="products">
                    <ul>
                      <h3> {editingOrder === order._id ? (
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value === "" ? order.deliveryStatus : e.target.value)}
                  >
                    {orderStatusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  order.deliveryStatus
                )}
                <span style={{float:"right"}}> {editingOrder === order._id ? (
                  <button onClick={() => handleSaveOrderStatus(order._id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditOrderStatus(order._id)} disabled={order.deliveryStatus === "Refunded"}>
                    Edit
                  </button>
                )}
                {order.deliveryStatus === "Refunded" && (
                  <p style={{color:"red",fontSize:"x-small"}}>Refunded successfully</p>
                )}</span></h3>
                      <p>{`Delivery Expected: ${formatDate(order.deliveryDate)}`}</p>
                      <p style={{ color: "red", fontSize: "x-small" }}>
                      {editingOrder === order._id ? (
                  <textarea
                    value={order.comments}
                    onChange={(e) => setOrderComments(e.target.value)}
                  />
                ) : (
                  order.comments
                )}
                      </p>

                      {order.productsOrdered.map((product) => {
                        const productDetails = products.find((p) => p._id === product.productID);
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
                      const productDetails = products.find((p) => p._id === product.productID);
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
                                <p>{`Delivery Expected: ${formatDate(order.deliveryDate)}`}</p>
                                <p style={{ color: "red", fontSize: "x-small"}}>
                                 <br/> {order.comments ? order.comments : ""}
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
      // <div>
      //   <h1>Orders</h1>
      //   <table>
      //     <thead>
      //       <tr>
      //         <th>Order ID</th>
      //         <th>Customer Details</th>
      //         <th>Product Details</th>
      //         <th>Total</th>
      //         <th>Payment Status</th>
      //         <th>Order Status</th>
      //         <th>Comments</th>
      //         <th>Actions</th>
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {orders.map(order => (
      //         <tr key={order._id}>
      //           <td>{order._id}</td>
      //           <td>
      //               <p><strong>{order.customer_details.name}</strong></p>
      //               <p>{order.customer_details.address.line1}<br />
      //               {order.customer_details.address.line2}<br />
      //               {order.customer_details.address.city}, {order.customer_details.address.state}<br />
      //               {order.customer_details.address.country} - {order.customer_details.address.postal_code}</p>
      //               <p><strong>{order.customer_details.phone}</strong></p>
      //               <p><strong>{order.customer_details.email}</strong></p>
      //             </td>
      //             <td>
      //             {order.productsOrdered.map(product => {
      //               const productDetails = products.find(p => p._id === product.productID);
      //               return (
      //                 <div key={product._id}>
      //                   {productDetails && (
      //                     <>
      //                       <img
      //                         src={`http://localhost:8000/${productDetails.image}`}
      //                         alt={productDetails.name}
      //                         className="productImage"
      //                         width="100px"
      //                       />
      //                       <div>
      //                         <p>{productDetails.name}</p>
      //                         <p>${productDetails.price}</p>
      //                         <p>Quantity: {product.orderedQuantity}</p>
      //                       </div>
      //                     </>
      //                   )}
      //                 </div>
      //               );
      //             })}
      //         </td>
      //           <td>${order.amount_subtotal/100}</td>
      //           <td>{order.payment_status}</td>
      //           <td>
      //             {editingOrder === order._id ? (
      //             <select
      //               value={orderStatus}
      //               onChange={(e) => setOrderStatus(e.target.value === "" ? order.deliveryStatus : e.target.value)}
      //             >
      //               {orderStatusOptions.map((option) => (
      //                 <option key={option} value={option}>{option}</option>
      //               ))}
      //             </select>
      //           ) : (
      //             order.deliveryStatus
      //           )}
      //         </td>
      //         <td>
      //           {editingOrder === order._id ? (
      //             <textarea
      //               value={order.comments}
      //               onChange={(e) => setOrderComments(e.target.value)}
      //             />
      //           ) : (
      //             order.comments
      //           )}
      //         </td>
      //         <td>
      //           {editingOrder === order._id ? (
      //             <button onClick={() => handleSaveOrderStatus(order._id)}>
      //               Save
      //             </button>
      //           ) : (
      //             <button onClick={() => handleEditOrderStatus(order._id)} disabled={order.deliveryStatus === "Refunded"}>
      //               Edit
      //             </button>
      //           )}
      //           {order.deliveryStatus === "Refunded" && (
      //             <p style={{color:"red",fontSize:"x-small"}}>Refunded successfully</p>
      //           )}
      //         </td>
      //         </tr>
      //       ))}
      //     </tbody>
      //   </table>
      // </div>
    );

  
 return (
    <div className="seller-dashboard-container">
       <ToastContainer />
      <nav className="side-navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <ul className="navbar-menu">
          <li>
            <Link
              className={`menu-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FontAwesomeIcon icon={faBoxOpen} />
              <span>Manage Orders</span>
            </Link>
          </li>
          <li>
            <Link
              className={`menu-item ${
                activeTab === "addProduct" ? "active" : ""
              }`}
              onClick={() => handleActiveTab("addProduct")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Product</span>
            </Link>
          </li>
          <li>
            <Link
              className={`menu-item ${
                activeTab === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <FontAwesomeIcon icon={faCog} />
              <span>My Details</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" className="menu-item">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
        <div className="user-profile">
          <FontAwesomeIcon icon={faUser} />
          <span>{details ? details.UserName : "Loading..."}</span>
        </div>
      </nav>
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
  
 export default SellerDashboard;