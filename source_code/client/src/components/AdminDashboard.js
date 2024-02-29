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
  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      setSuccessMessage("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      setErrorMessage("Failed to delete product");
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



  const handleEditProduct = (id) => {
    // Find the product by ID
    const product = products.find((product) => product._id === id);
    // Set the form data to the details of the product being edited
    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      category: product.category,
      image: product.image
    });
    // Set the editingProduct state to the ID of the product being edited
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
      setSuccessMessage("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error.message);
      setErrorMessage("Failed to update user details");
    }
  };

  const handleEditUser = (id) => {
    // Find the user by ID
    const user = users.find((user) => user._id === id);
    // Set the form data to the details of the user being edited
    setFormData({
      id: user._id,
      username: user.UserName,
      email: user.Email,
      phoneNumber: user.PhoneNumber || "",
      address: user.Address || "",
    });
    // Change the active tab to the settings tab
    setActiveTab("settings");
  };
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      await axios.delete(`http://localhost:8000/api/users/${id}`);

      setUsers(users.filter((user) => user._id !== id));

      setSuccessMessage("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.message);

      setErrorMessage("Failed to delete user");
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1>Dashboard</h1>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="product-list">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="product-item">
                    {product.image && typeof product.image === "object" && (
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt="Selected"
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}

                    <p>{product.name}</p>

                    <p>Price: ${product.price}</p>

                    <p>Quantity: {product.quantity}</p>

                    <div className="product-actions">
                      <button>
                        <FontAwesomeIcon
                          icon={faEdit}
                          onClick={() => handleEditProduct(product._id)}
                        />

                        {/* <span>Edit</span> */}
                      </button>

                      <button onClick={() => handleDeleteProduct(product._id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />

                        {/* <span>Delete</span> */}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="settings-form">
            <h1>Settings</h1>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

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

              <button type="submit">Update Details</button>
            </form>
          </div>
        );

      case "orders":
        return (
          <div>
            <h1>Orders</h1>

            {/* Add your Orders content here */}
          </div>
        );

      case "addProduct":
        return (
          <div className="add-product-form-container">
            <h1>{formData.name ? "Update Product" : "Add Product"}</h1>

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
                  required
                />
              </div>

              {formData.image && typeof formData.image === "object" && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Selected"
                  style={{ width: "100px", height: "100px" }}
                />
              )}

              <button type="submit">
                {formData.name ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        );

      case "manageCustomers":
        return (
          <div>
            <h1>Manage Users</h1>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <table>
              <thead>
                <tr>
                  <th>Username</th>

                  <th>Email</th>

                  <th>Phone Number</th>

                  <th>Address</th>

                  <th>Role</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.UserName}</td>

                      <td>{user.Email}</td>

                      <td>{user.PhoneNumber}</td>

                      <td>{user.Address}</td>

                      <td>{user.Role}</td>

                      <td>
                        <button onClick={() => handleDeleteUser(user._id)}>
                          Delete
                        </button>

                        <button onClick={() => handleEditUser(user._id)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="Admin-dashboard-container">
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

              <span>Orders</span>
            </Link>
          </li>

          <li>
            <Link
              className={`menu-item ${
                activeTab === "addProduct" ? "active" : ""
              }`}
              onClick={() => setActiveTab("addProduct")}
            >
              <FontAwesomeIcon icon={faPlus} />

              <span>Add Product</span>
            </Link>
          </li>

          <li>
            <Link
              className={`menu-item ${
                activeTab === "manageCustomers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("manageCustomers")}
            >
              <FontAwesomeIcon icon={faUser} />

              <span>Manage Users</span>
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

              <span>Settings</span>
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

      <main className="main">{renderContent()}</main>
    </div>
  );
}
export default AdminDashboard;
