import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    // password: "",
    // newPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

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
      setUserData({
        id: userDetailsRes.data.User._id,
        username: userDetailsRes.data.User.UserName,
        email: userDetailsRes.data.User.Email,
        phoneNumber: userDetailsRes.data.User.PhoneNumber,
        address: userDetailsRes.data.User.Address,
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

    console.log("Submit",         {
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
      address: userData?.address,
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const res = await axios.put(
        `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/api/updateProfile/${userData?.id}`,
        {
          email: userData?.email,
          phoneNumber: userData?.phoneNumber,
          address: userData?.address,
        }
      );
      setSuccessMessage(res.data.message);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setSuccessMessage("");
      setErrorMessage("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile">
      <h1>My Profile</h1>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
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
            disabled={true}
            style={{color: "black"}}
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
        {/* <div>
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
        </div> */}
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
}

export default ProfilePage;
