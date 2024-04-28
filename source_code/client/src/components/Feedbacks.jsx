import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GlobalConnect.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Footer from "./Footer";
import MainNav from "./MainNav";
import Topnav from "./Topnav";
function Feedbacks() {
 const nav = useNavigate();
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [des, setDes] = useState("");
 const notifySuccess = (message) => toast.success(message);
 const notifyError = (message) => toast.error(message);
 
 const handleSubmit = async (e) => {
   e.preventDefault();
 
   try {
     const res = await axios.post("http://localhost:8000/userfeedbacks", {
       username,
       email,
       des,
     });
     notifySuccess("Feedback Submitted Successfully");
     nav("/", { replace: true });
   } catch (error) {
     console.error("Error during Feedback Submission:", error);
     notifyError("Failed to Submit Feedback. Please try again later.");
   }
 };
 
 return (
   <>
     <Topnav />
     <MainNav />
 
     <div
       className="registration-form"
       style={{
         backgroundImage: 'url("./p3.webp")',
         backgroundSize: "cover",
         backgroundPosition: "center",
         backgroundRepeat: "no-repeat",
       }}
     >
       <ToastContainer />
 
       <form onSubmit={handleSubmit} className="mt-5">
         <div
           className="register-logo"
           style={{
             width: "100%",
             background: "#7e5888",
             display: "flex",
             justifyContent: "center",
           }}
         >
           <img
             src={logo}
             alt="Company Logo"
             style={{ width: "10rem", height: "8rem" }}
           />
         </div>
 
         <div className="form-group" style={{ marginTop: "1rem" }}>
         <label>Username:</label>
           <input
             type="text"
             className="form-control item"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             placeholder="Enter Your Username"
             required
           />
         </div>
         <div className="form-group">
         <label>Email id:</label>
           <input
             type="email"
             className="form-control item"
             placeholder="Enter Your Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>
         <div className="form-group">
         <label>Provide Feedback for Website:</label>
           <textarea
             placeholder="Enter Feedback"
             className="form-control item"
             value={des}
             onChange={(e) => setDes(e.target.value)}
             required
           />
         </div>
 
         <div className="form-group">
           <button
             type="submit"
             className="btn btn-block create-account"
             style={{ background: "#7e5888" }}
           >
             Send Feedback
           </button>
         </div>
       </form>
     </div>
     <Footer />
   </>
 );
}
 
export default Feedbacks;
 
 