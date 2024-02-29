import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    newPassword: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const userDetailsRes = await axios.get("http://localhost:8000/api/userDetails");
      setUserData({
        id: userDetailsRes.data.User._id,
        username: userDetailsRes.data.User.UserName,
        email: userDetailsRes.data.User.Email,
        phoneNumber: userDetailsRes.data.User.PhoneNumber,
        address: userDetailsRes.data.User.Address
      });
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setErrorMessage("Failed to fetch user details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const res = await axios.put("http://localhost:8000/api/updateProfile", userData);
      setSuccessMessage(res.data.message);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setErrorMessage("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile">
      <h1>My Profile</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={userData.address}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="password">Current Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
}

export default ProfilePage;