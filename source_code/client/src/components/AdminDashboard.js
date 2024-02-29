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
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/GlobalConnect.png";
import "../styles/AdminDashboard.css";
import axios from "axios";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState({});
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    image: null,
    category: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
    initializeFormData();
  }, []);
  
  const initializeFormData = () => {
    // Populate formData with user details
    setFormData({
      username: details.UserName,
      email: details.Email,
      phoneNumber: details.PhoneNumber || "",
      address: details.Address || "",
      password: "", // You may choose to populate this or leave it empty
      newPassword: "", // You may choose to populate this or leave it empty
    });
  };
};
  export default AdminDashboard;