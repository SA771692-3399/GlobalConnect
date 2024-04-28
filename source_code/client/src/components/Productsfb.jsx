import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/GlobalConnect.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Footer from "./Footer";
import MainNav from "./MainNav";
import Topnav from "./Topnav";
 
function Productfb() {
 const { id } = useParams(); // Get the ID from the URL
 const nav = useNavigate();
 const [username, setUsername] = useState(localStorage?.getItem("username"));
 const [rating, setRating] = useState("1");
 const [des, setDes] = useState("");
 const notifySuccess = (message) => toast.success(message);
 const notifyError = (message) => toast.error(message);
 
 const handleSubmit = async (e) => {
   e.preventDefault();
 
   try {
     const token = localStorage.getItem("token");
     if (!token) throw new Error("No token found");
     axios.defaults.headers.common["Authorization"] = "Bearer " + token;
 
     const res = await axios.post(`http://localhost:8000/user/productFb/${id}`, {
       username,
       rating,
       des,
     });
     notifySuccess("Feedback Submitted Successfully");
     nav("/user", { replace: true });
   } catch (error) {
     console.error("Error during Feedback Submission:", error);
     notifyError("Failed to Submit Feedback. Please try again later.");
   }
 };
 
 return (
   
 );
}
 
export default Productfb;
 
 