import React, { useState, useEffect } from 'react';
import { CiStar } from "react-icons/ci";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import axios from 'axios';
 
const Blogs5 = ({ selectedProduct }) => {
 const [feedbacks, setFeedbacks] = useState([]);
 const [showAll, setShowAll] = useState(false);
 
 useEffect(() => {
   const fetchData = async () => {
     try {
       const token = localStorage.getItem("token");
       if (!token) throw new Error("No token found");
       axios.defaults.headers.common["Authorization"] = "Bearer " + token;
 
       const response = await axios.get(`http://localhost:8000/user/getProductFb/${selectedProduct._id}`);
       console.log("API Response:", response.data); // Check the API response data structure
       setFeedbacks(response.data.productFeedbacks); // Assuming the API returns an array of feedback objects
       console.log(response.data.productFeedbacks);
     } catch (error) {
       console.error("Error fetching feedback data:", error);
     }
   };
 
   fetchData();
 }, []);
 
 const handleShowAll = () => {
   setShowAll(true);
 };
 
 const handleHideAll = () => {
   setShowAll(false);
 };
 
 return (
   <div className="container">
     <p>Customer Feedbacks</p>
     <div className="row">
       {feedbacks.map((feedback, index) => (
         <div key={feedback._id} className={`col-md-4 ${!showAll && index > 2 ? 'd-none' : ''}`}>
           <div className="card text-center py-4">
             <h5 className="card-heading">{feedback.username}</h5>
             <div className="ratings ">
               {[...Array(feedback.rating)].map((_, i) => (
                 <CiStar key={i} size={20} color='#7e5888' />
               ))}
             </div>
             <div className="review text-center" style={{ fontSize: "12px", color: "gray", padding: "10px" }}>
               <p>{showAll ? feedback.des : `${feedback.des.split(' ').slice(0, 20).join(' ')}...`}</p>
             </div>
           </div>
         </div>
       ))}
     </div>
     <div className="text-center mt-4 mb-5">
       {!showAll ? (
         <FaArrowAltCircleDown onClick={handleShowAll} size={30} color='#7e5888'/>
       ) : (
         <FaArrowAltCircleUp onClick={handleHideAll}size={30} color='#7e5888'/>
       )}
     </div>
 
   </div>
 );
}
 
export default Blogs5;
 
 