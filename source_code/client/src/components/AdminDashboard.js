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
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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

      const usersRes = await axios.get("http://localhost:8000/api/users");
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setErrorMessage("Failed to fetch data");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, price, description, quantity, image, category } = formData;
      if (!name || !price || !description || !quantity || !image || !category) {
        throw new Error("Missing required fields");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("price", price);
      formDataToSend.append("description", description);
      formDataToSend.append("quantity", quantity);
      formDataToSend.append("image", image);
      formDataToSend.append("category", category);
      formDataToSend.append("seller", details._id);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      if (editingProduct) {
        // If editing, update the existing product
        const res = await axios.put(
          `http://localhost:8000/api/products/${editingProduct}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedProductIndex = products.findIndex(
          (product) => product._id === editingProduct
        );
        const updatedProducts = [...products];
        updatedProducts[updatedProductIndex] = res.data.product;
        setProducts(updatedProducts);
        setEditingProduct(null);
        setActiveTab("dashboard");
        setSuccessMessage("Product updated successfully");
      } else {
        // If not editing, add a new product
        const res = await axios.post(
          "http://localhost:8000/api/products",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts([...products, res.data.product]);
        setActiveTab("dashboard");
        setSuccessMessage("Product added successfully");
      }

      // Reset form data
      setFormData({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: null,
        category: "",
      });
    } catch (error) {
      console.error("Error adding/updating product:", error.message);
      setErrorMessage("Failed to add/update product");
    }
  };
}
export default AdminDashboard;
