import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';
import {
  faHome,
  faBoxOpen,
  faUser,
  faSignOutAlt,
  faPlus,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/GlobalConnect.png";
import "../styles/AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisplayProduct from "./DisplayProduct";
import Tests from "./Tests";
import AddImg from "./AddImg";
import AdminFqa from "./AdminFqa";
import AddFqa from "./AddFqa";
import APadmin from "./APadmin";
import { clothOptions, foodOptions, initAddProduct } from "../utils/generalUtils";

function AdminDashboard() {
  const Role = localStorage.getItem("Role");
  const userID = localStorage.getItem("userID");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productPrices, setProductPrices] = useState([]);

  const [formData, setFormData] = useState();

  const sizeOptions = formData?.category?.toLowerCase() == "food" ? foodOptions : clothOptions;

  const InitAddForm = () => {
    setSelectedSizes(() => []);
    setProductPrices(() => []);
    setFormData(initAddProduct);
  }

  const [editingProduct, setEditingProduct] = useState(null);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const nav = useNavigate();
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderComments, setOrderComments] = useState("");
  const orderStatusOptions = [
    "Order placed",
    "Order confirmed",
    "Order processing",
    "Order Shipped",
    "Order Dispatched",
    "In transit",
    "Out for delivery",
    "Delivered",
    "Attempted delivery",
    "Canceled",
    "Held at customs",
    "Awaiting pickup",
    "Delayed",
    "Lost",
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
        sizeProduct: [],
        spice: "",
      });
      setEditingProduct(null);
    }
  };
  const handleSaveOrderStatus = async (orderId, order) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      if (orderComments === "") {
        setOrderComments("Updated by Admin");
      }

      // let newProductsStatus = order?.productsOrdered?.map((o) => ({
      //   ...o,
      //   productDeliveryStatus: orderStatus
      // }))

      await axios.patch(`http://localhost:8000/seller/orders/${orderId}`, {
        productsOrdered: order?.productsOrdered,
        deliveryStatus: orderStatus,
        comments: orderComments,
      });

      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, deliveryStatus: orderStatus, comments: orderComments }
            : order
        )
      );
      setEditingOrder(null);
      notifySuccess("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error.message);
      notifyError("Failed to update order status");
    }
  };

  const handleEditOrderStatus = (orderId, order) => {
    setEditingOrder(orderId);
    setOrderComments(order?.comments)
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
      setFormData({
        id: userDetailsRes.data.User._id,
        username: userDetailsRes.data.User.UserName,
        email: userDetailsRes.data.User.Email,
        phoneNumber: userDetailsRes.data.User.PhoneNumber || "",
        address: userDetailsRes.data.User.Address || "",
      });

      const productsRes = await axios.get("http://localhost:8000/api/products");
      setProducts(productsRes.data.products);

      const usersRes = await axios.get("http://localhost:8000/admin/users");
      setUsers(usersRes.data);
      const ordersRes = await axios.get("http://localhost:8000/admin/orders");
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      notifyError("Failed to fetch data");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      await axios.delete(`http://localhost:8000/admin-seller/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      notifySuccess("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      notifyError("Failed to delete product");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSizeChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizeProduct: selectedOptions.map((option) => option.value),
    }));
  };

  // useEffect(() => {
  //   console.log("🚀 ~ productPrices:", productPrices)
  //   console.log("🚀 ~ formData:", formData)
  // }, [formData, productPrices]);

  const handlePriceChange = (size, price) => {

    let updatedPrices;
  
    const existingIndex = productPrices.findIndex(item => item.size === size?.value);
  
    if (existingIndex !== -1) {
      updatedPrices = productPrices.map((item, index) => {
        if (index === existingIndex) {
          return { ...item, price: price };
        }
        return item;
      });
    } else {
      updatedPrices = [
        ...productPrices,
        {
          size: size?.value,
          price: price
        }
      ];
    }
  
   
 
}

export default AdminDashboard;


