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
} from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/GlobalConnect.png";

import "../styles/SellerDashboard.css";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function SellerDashboard() {
  const Role = localStorage.getItem("Role");

  alert(Role);

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

  const [orderStatus, setOrderStatus] = useState("");

  const [orderComments, setOrderComments] = useState("");

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

      if (orderComments === "") {
        setOrderComments("Updated by Seller");
      }

      await axios.patch(`http://localhost:8000/seller/orders/${orderId}`, {
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

      const productsRes = await axios.get("http://localhost:8000/api/products");

      setProducts(productsRes.data.products);

      const ordersRes = await axios.get("http://localhost:8000/seller/orders");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { id, name, price, description, quantity, image, category } =
        formData;

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
        const res = await axios.patch(
          `http://localhost:8000/admin-seller/products/${editingProduct}`,

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

        notifySuccess("Product updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:8000/admin-seller/products",

          formDataToSend,

          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setProducts([...products, res.data.product]);

        setActiveTab("dashboard");

        notifySuccess("Product added successfully");
      }

      setFormData({
        id: "",

        name: "",

        price: "",

        description: "",

        quantity: "",

        image: null,

        category: "",
      });
    } catch (error) {
      console.error("Error adding/updating product:", error.message);

      notifyError("Failed to add/update product");
    }

    fetchData();
  };

  const handleEditProduct = (id) => {
    const product = products.find((product) => product._id === id);

    setFormData({
      id: product._id,

      name: product.name,

      price: product.price,

      description: product.description,

      quantity: product.quantity,

      category: product.category,

      image: product.image,
    });

    setActiveTab("addProduct");

    setEditingProduct(id);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    try {
      const {
        id,

        username,

        email,

        phoneNumber,

        address,

        password,

        newPassword,
      } = formData;

      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const res = await axios.put("http://localhost:8000/api/updateProfile", {
        id,

        username,

        email,

        phoneNumber,

        address,

        password,

        newPassword,
      });

      setDetails(res.data.User);

      notifySuccess("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error.message);

      notifyError("Failed to update user details");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1>Dashboard</h1>

            <div className="product-list">
              {products && products.length > 0 ? (
                products.map(
                  (product) =>
                    product && (
                      <div key={product._id} className="product-item">
                        {product.image && (
                          <img
                            src={`http://localhost:8000/${product.image}`}
                            alt="Selected"
                            style={{ width: "100px", height: "100px" }}
                          />
                        )}

                        <div className="ProductDetails">
                          <p>{product.name}</p>

                          <p>Price: ${product.price}</p>

                          <p>Quantity: {product.quantity}</p>
                        </div>

                        <div className="product-actions">
                          <button>
                            <FontAwesomeIcon
                              icon={faEdit}
                              onClick={() => handleEditProduct(product._id)}
                            />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    )
                )
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="settings-form">
            <h1>Edit Profile</h1>

            <form onSubmit={handleUpdateDetails}>
              <div>
                <label htmlFor="username">Username:</label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email:</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber">Phone Number:</label>

                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="address">Address:</label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <label htmlFor="password">Current Password:</label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword">New Password:</label>

                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit">Edit Profile</button>
            </form>
          </div>
        );

      case "orders":
        return (
          <div>
            <h1>Orders</h1>

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>

                  <th>Customer Details</th>

                  <th>Product Details</th>

                  <th>Total</th>

                  <th>Payment Status</th>

                  <th>Order Status</th>

                  <th>Comments</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>

                    <td>
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
                    </td>

                    <td>
                      {order.productsOrdered.map((product) => {
                        const productDetails = products.find(
                          (p) => p._id === product.productID
                        );

                        return (
                          <div key={product._id}>
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

                                  <p>${productDetails.price}</p>

                                  <p>Quantity: {product.orderedQuantity}</p>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </td>

                    <td>${order.amount_subtotal / 100}</td>

                    <td>{order.payment_status}</td>

                    <td>
                      {editingOrder === order._id ? (
                        <select
                          value={orderStatus}
                          onChange={(e) =>
                            setOrderStatus(
                              e.target.value === ""
                                ? order.deliveryStatus
                                : e.target.value
                            )
                          }
                        >
                          {orderStatusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.deliveryStatus
                      )}
                    </td>

                    <td>
                      {editingOrder === order._id ? (
                        <textarea
                          value={order.comments}
                          onChange={(e) => setOrderComments(e.target.value)}
                        />
                      ) : (
                        order.comments
                      )}
                    </td>

                    <td>
                      {editingOrder === order._id ? (
                        <button
                          onClick={() => handleSaveOrderStatus(order._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditOrderStatus(order._id)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "addProduct":
        return (
          <div className="add-product-form-container">
            <h1>{formData.id ? "Update Product" : "Add Product"}</h1>

            <form className="add-product-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="productName">Product Name:</label>

                <input
                  type="text"
                  id="productName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="productPrice">Product Price:</label>

                <input
                  type="number"
                  id="productPrice"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="category">Category:</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>

                  <option value="Clothing">Clothing</option>

                  <option value="Food">Food</option>

                  <option value="Local business">Local business</option>
                </select>
              </div>

              <div>
                <label htmlFor="productDescription">Product Description:</label>

                <textarea
                  id="productDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="productQuantity">Quantity:</label>

                <input
                  type="number"
                  id="productQuantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="productImage">Upload Image:</label>

                <input
                  type="file"
                  id="productImage"
                  name="image"
                  onChange={handleInputChange}
                  required={formData.image ? false : true}
                />
              </div>

              {formData.image && (
                <img
                  src={
                    formData.image && typeof formData.image === "object"
                      ? URL.createObjectURL(formData.image)
                      : `http://localhost:8000/${formData.image}`
                  }
                  alt="Selected"
                  style={{ width: "100px", height: "100px" }}
                />
              )}

              <button type="submit">
                {formData.id ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

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

              <span>Edit Profile</span>
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
}

export default SellerDashboard;