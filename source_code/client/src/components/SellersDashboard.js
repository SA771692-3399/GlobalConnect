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
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tests from "./Tests";
import AddImg from "./AddImg";
import DisplayProducts from "./DisplayProducts";
import { clothOptions, foodOptions, initAddProduct } from "../utils/generalUtils";

function SellerDashboard() {
  const Role = localStorage.getItem("Role");
  const userID = localStorage.getItem("userID");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [formData, setFormData] = useState();

  const sizeOptions = formData?.category?.toLowerCase() == "food" ? foodOptions : clothOptions;

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
        setOrderComments("Updated by Seller");
      }

      let otherProducts = order?.productsOrdered?.filter(e => e?.sellerId != userID);

      let newProductsStatus = order?.productsOrdered?.filter(e => e?.sellerId == userID)?.map((o) => ({
        ...o,
        productDeliveryStatus: orderStatus
      }))

      await axios.patch(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/seller/orders/${orderId}`, {
        productsOrdered: [
          ...otherProducts,
          ...newProductsStatus
        ],
        // deliveryStatus: orderStatus,
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
  const handleSizeChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizeProduct: selectedOptions.map((option) => option.value),
    }));
  };

  const InitAddForm = () => {
    setSelectedSizes(() => []);
    setProductPrices(() => []);
    setFormData(initAddProduct);
  }

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
    });
  };
  const handleEditPlace = (id) => {
    setActiveTab("myplace");
    setEditingProduct(id);
  };
  const handlePic = (id) => {
    setActiveTab("addPic");
    setEditingProduct(id);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      try {
        await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/check-auth");
      } catch (e) {
        console.log(e);
        alert("session expired");
        nav("/login");
      }

      const userDetailsRes = await axios.get(
        "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/userDetails"
      );
      setDetails(userDetailsRes.data.User);

      const productsRes = await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/products");
      setProducts(productsRes.data.products);

      const ordersRes = await axios.get("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/seller/orders");
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      //notifyError("Failed to fetch data");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      await axios.delete(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      notifySuccess("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      notifyError("Failed to delete product");
    }
  };

  useEffect(() => {
    console.log("selectedSizes", selectedSizes);
  }, [selectedSizes])

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
      const {
        id,
        name,
        productPrices,
        description,
        quantity,
        image,
        category,
        sizeProduct,
        spice,
      } = formData;
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
      // formDataToSend.append("productPrices", JSON.stringify(productPrices));
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
      
      if (formData?.category?.toLowerCase() !== "food") {
        formDataToSend.append("spice", spice);
      }

      formDataToSend.append("seller", details._id);
      setSelectedSizes(sizeProduct || []);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      if (editingProduct) {
        const res = await axios.patch(
          `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/products/${editingProduct}`,
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
        setSelectedSizes(() => []);
        setProductPrices(() => []);
        setEditingProduct(null);
        setActiveTab("dashboard");
        notifySuccess("Product updated successfully");
      } else {
        const res = await axios.post(
          "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/products",
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
      sizeProduct: product.sizeProduct,
      productPrices: product?.productPrices,
      spice: product.spice,
    });

    let sizes = product?.category?.toLowerCase() == "food" ? foodOptions : clothOptions;

    setSelectedSizes(() => product?.sizeProduct?.[0]?.split(",")?.map((e) => sizes?.find((v) => v?.value == e)));
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
        // password,
        // newPassword,
      } = formData;

      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
    
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const res = await axios.put("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/updateProfile/"+ userID, {
        // userID,
        // id,
        // username,
        email,
        phoneNumber,
        address,
        // password,
        // newPassword,
      });
      setDetails(res.data.User);
      notifySuccess("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error.message);
      notifyError("Failed to update user details");
    }
  };

  const getProductsPrice = (order) => {
    let products = order?.productsOrdered?.filter(e => e?.sellerId == userID);

    let total = 0;
    products?.map(p => total += (p?.productPrice * p?.orderedQuantity))

    return total?.toFixed(2)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
          <DisplayProducts
            products={products}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleEditPlace={handleEditPlace}
            handlePic={handlePic}
            Role={Role}
            userID={userID}
          />
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
      case "myplace":
        return <Tests productId={editingProduct} />;
      case "addPic":
        return <AddImg productId={editingProduct} />;
      case "orders":
        return (
          <div>
            <h1>Orders</h1>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  {/* <th>Tracking ID</th> */}
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
                    <td>{`${order._id.substring(order._id.length - 8)}`}</td>
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
                      <div style={{minWidth: "10rem"}}>
                        {order?.productsOrdered?.filter(e => e?.sellerId == userID)?.map((o, i) => (
                          <div key={i} className="d-flex align-items-start gap-2 rounded mb-3" style={{backgroundColor: "white", padding: "0.4rem"}}>
                            <img src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${o?.image}`} alt={o?.name} className="rounded" style={{ objectFit: "contain", width: "3rem" }} />
                            <div className="">
                              <div>{`${o?.productName} (${o?.orderedSize})`}</div>
                              <div>Qty: {o?.orderedQuantity}</div>
                              <div>Price: ${o?.productPrice}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>${getProductsPrice(order)}</td>
                    {/* <td>${order.amount_subtotal / 100}</td> */}
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
                          value={orderComments}
                          onChange={(e) => setOrderComments(e.target.value)}
                        />
                      ) : (
                        order.comments ?? "--"
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

                  {Role === "LocalOwner" ? (
                    <>
                      <option value="Local business">Local business</option>
                    </>
                  ) : (
                    <>
                      <option value="Clothing">Clothing</option>
                      <option value="Food">Food</option>
                    </>
                  )}
                </select>
              </div>

              {formData?.category?.toLowerCase() !== "food" && (
                <div>
                  <label htmlFor="spice">
                    {Role === "LocalOwner" ? "Spice" : "Color"}
                  </label>
                  {Role === "LocalOwner" ? (
                    <select
                      id="spice"
                      name="spice"
                      value={formData.spice}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Select a {Role === "LocalOwner" ? "Spice" : "Color"}
                      </option>
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
                      : `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${formData.image}`
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
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
}

export default SellerDashboard;
