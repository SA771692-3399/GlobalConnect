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
 export default SellerDashboard;