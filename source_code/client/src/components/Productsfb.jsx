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
   <>
     <Topnav />
     <MainNav />
 
     <div className="registration-form" style={{ backgroundImage: 'url("https://media.istockphoto.com/id/1454649439/photo/kadhi-samosa-chaat.webp?b=1&s=170667a&w=0&k=20&c=7TWSZJPfi5Cz8YuGG554RHbrWKsuz9Ihf-FCvt7_TcQ=")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
       <ToastContainer />
 
       <form onSubmit={handleSubmit} className="mt-5">
         <div className="register-logo" style={{ width: '100%', background: "#7e5888", display: "flex", justifyContent: "center" }}>
           <img src={logo} alt="Company Logo" style={{ width: '10rem', height: "8rem" }} />
         </div>
 
         <div className="form-group" style={{ marginTop: "1rem" }}>
           <label>Username:</label>
           <input
             type="text"
             className="form-control item remove-border-css"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             placeholder="Enter Your Username"
             required
             disabled={true}
             style={{ color: "black" }}
           />
         </div>
         <div className="form-group">
         <label>Star Rating for product:</label>
           <select
             type="number"
             className="form-control item"
             value={rating}
             onChange={(e) => setRating(e.target.value)}
             required
           >
             
             <option value="1">1</option>
             <option value="2">2</option>
             <option value="3">3</option>
             <option value="4">4</option>
             <option value="5">5</option>
           </select>
         </div>
         <div className="form-group">
           <label>Provide Feedback:</label>
           <textarea
             placeholder="Enter Feedback"
             className="form-control item"
             value={des}
             onChange={(e) => setDes(e.target.value)}
             required
           />
         </div>
 
         <div className="form-group">
           <button type="submit" className="btn btn-block create-account" style={{ background: "#7e5888" }}>
             Send Feedback
           </button>
         </div>
       </form>
     </div>
     <Footer />
   </>
 );
}
 
export default Productfb;
 
 