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
  
    setProductPrices(updatedPrices);

    setFormData((prevFormData) => ({
      ...prevFormData,
      productPrices: updatedPrices,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        name,
        productPrices,
        description,
        quantity,
        image,
        category,
        sizeProduct,
        spice,
      } = formData;

      console.log("FormData", formData);

      if (
        !name ||
        productPrices?.length === 0 ||
        !description ||
        !quantity ||
        !image ||
        !category ||
        !sizeProduct 
      ) {
        throw new Error("Missing required fields");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      // formDataToSend.append("price", price);
      productPrices.forEach((price, index) => {
        Object.entries(price).forEach(([key, value]) => {
          formDataToSend.append(`productPrices[${index}][${key}]`, value);
        });
      });
      formDataToSend.append("description", description);
      formDataToSend.append("quantity", quantity);
      formDataToSend.append("image", image);
      formDataToSend.append("category", category);
      formDataToSend.append("sizeProduct", sizeProduct);
      formDataToSend.append("spice", spice);

      formDataToSend.append("seller", details._id);
      setSelectedSizes(sizeProduct || []);
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
        setSelectedSizes([]);
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
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: null,
        category: "",
        sizeProduct: [],
        spice: "",
      });
    } catch (error) {
      console.error("Error adding/updating product:", error.message);
      notifyError("Failed to add/update product");
    }
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
      sizeProduct: product.sizeProduct,
      productPrices: product?.productPrices,
      spice: product.spice,
    });
    

    setSelectedSizes(() => product?.sizeProduct?.[0]?.split(",")?.map((e) => sizeOptions?.find((v) => v?.value == e)));
    setProductPrices(() => product?.productPrices);

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
      } = formData;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const res = await axios.put("http://localhost:8000/api/updateProfile/"+ userID, {
        email,
        phoneNumber,
        address,
      });
      setDetails(res.data.User);
      notifySuccess("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error.message);
      notifyError("Failed to update user details");
    }
  };

  const handleEditUser = (id) => {
    const user = users.find((user) => user._id === id);
    setFormData({
      id: user._id,
      username: user.UserName,
      email: user.Email,
      phoneNumber: user.PhoneNumber || "",
      address: user.Address || "",
    });
    setActiveTab("settings");
  };
  const handleEditPlace = (id) => {
    setActiveTab("myplace");
    setEditingProduct(id);
  };
  const handlePic = (id) => {
    setActiveTab("addPic");
    setEditingProduct(id);
  };
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      await axios.delete(`http://localhost:8000/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      notifySuccess("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      notifyError("Failed to delete user");
    }
  };
  useEffect(() => {
    console.log(products, "useEffect");
  }, [products]);
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DisplayProduct
            products={products}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleEditPlace={handleEditPlace}
            handlePic={handlePic}
          />
        );
      case "addFaq":
        return (
          <>
            <AddFqa />
          </>
        );
      case "faq":
        return (
          <>
            <AdminFqa />
          </>
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
                  disabled={true}
                  style={{ color: "black" }}
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
              {/* <div>
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
              </div> */}
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
                    <td>
                  
                    <p>{`Tracking ID: TID${order._id.substring(order._id.length - 8)}`}</p>
                    <p>Order ID: {order._id}</p>
                    </td>
                    <td>
                      <p>
                        <strong>
                          {order.customer_details?.name || "N/A"}{" "}
                        </strong>
                      </p>
                      <p>
                        {order.customer_details?.address?.line1 || "N/A"}
                        <br />
                        {order.customer_details?.address?.line2 || "N/A"}
                        <br />
                        {order.customer_details?.address?.city || "N/A"},{" "}
                        {order.customer_details?.address?.state || "N/A"}
                        <br />
                        {order.customer_details?.address?.country ||
                          "N/A"} -{" "}
                        {order.customer_details?.address?.postal_code || "N/A"}
                      </p>
                      <p>
                        <strong>
                          {order.customer_details?.phone || "N/A"}
                        </strong>
                      </p>
                      <p>
                        <strong>
                          {order.customer_details?.email || "N/A"}
                        </strong>
                      </p>
                    </td>
                    <td>
                    <div style={{minWidth: "10rem"}}>
                        {order?.productsOrdered?.map((o, i) => (
                          <div key={i} className="d-flex align-items-start gap-2 rounded mb-3" style={{backgroundColor: "white", padding: "0.4rem"}}>
                            <img src={`http://localhost:8000/${o?.image}`} alt={o?.name} className="rounded" style={{ objectFit: "contain", width: "3rem" }} />
                            <div className="">
                              <div>{`${o?.productName} (${o?.orderedSize})`}</div>
                              <div>Qty: {o?.orderedQuantity}</div>
                              <div>Price: ${o?.productPrice}</div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                          onClick={() => handleSaveOrderStatus(order._id, order)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditOrderStatus(order._id, order)}
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
            {/* <div>
              <label htmlFor="productPrice">Product Price:</label>
              <input
                type="number"
                id="productPrice"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div> */}
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

            {formData?.category?.toLowerCase() !== "food" && (
                <div>
                  <label htmlFor="spice">
                    {formData.category === "Local business" ? "Spice" : "Color"}
                  </label>
                  {formData.category === "Local business" ? (
                    <select
                      id="spice"
                      name="spice"
                      value={formData.spice}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Spice</option>
                      <option value="mild">Mild</option>
                      <option value="regular">Regular</option>
                      <option value="spicy">Spicy</option>
                    </select>
                  ) : (
                    <input
                        id="spice"
                        name="spice"
                        value={formData.spice}
                        onChange={handleInputChange}
                      />
                  )}
                </div>
            )}

            <div className="mb-3">
              <label htmlFor="sizeProduct">
                Size
              </label>
              <Select
                options={sizeOptions}
                isMulti
                value={selectedSizes}
                onChange={handleSizeChange}
              />
            </div>

            {selectedSizes?.length > 0 && (
                <div>
                  <label htmlFor="productPrice">Product Price:</label>
                  {selectedSizes?.map((o, i) => (
                    <div key={i} className="mt-2 d-flex justify-content-between gap-6">
                      <div>{o?.label}</div>
                      <div>
                        <input
                          type="number"
                          id="productQuantity"
                          name="quantity"
                          placeholder="Enter Product Price..."
                          value={productPrices?.find(a => a?.size === o?.value )?.price || ''}
                          onChange={(e) => handlePriceChange(o, e?.target?.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
              {formData.name ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
        );
      case "myplace":
        return <Tests productId={editingProduct} />;
      case "addPic":
        return <AddImg productId={editingProduct} />;
      case "manageCustomers":
        return (
          <div>
            <h1>Manage Users</h1>
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
              onClick={() => { 
                handleActiveTab("addProduct");
                InitAddForm();
          }}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Product</span>
            </Link>
          </li>
          <li>
            <Link
              className={`menu-item ${activeTab === "addFaq" ? "active" : ""}`}
              onClick={() => handleActiveTab("addFaq")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Faqs</span>
            </Link>
          </li>
          <li>
            <Link
              className={`menu-item ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => handleActiveTab("faq")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>FAQs</span>
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
              onClick={() => {
                setActiveTab("settings");
                initializeFormData();
              }}
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
      <main className="main">{renderContent()}</main>
    </div>
  );
}

export default AdminDashboard;


