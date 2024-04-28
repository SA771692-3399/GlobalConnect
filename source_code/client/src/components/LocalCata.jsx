import React, { useState } from "react";
import "./Cata.css";
import { Modal } from "react-bootstrap";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import Test2 from "./Test2";
 
export default function LocalCata({
 filteredProducts,
 handleProductClick,
 addToCart,
}) {
 const [placename, setPlaceName] = useState("");
 const [showPopup, setShowPopup] = useState(true);
 const [receivedData, setReceivedData] = useState(null);
 
 const handleDataReceive = (data) => {
   setReceivedData(data);
   setShowPopup(false); // Hide the modal after receiving data
 };
 
 const handleCloseModal = () => {
   setShowPopup(false);
 };
 
 const filteredByPlaceName = filteredProducts.filter((product) => {
   if (receivedData && receivedData.placename) {
     const receivedPlace = receivedData.placename.toLowerCase().trim();
     const productPlace = product.placename
       ? product.placename.toLowerCase().trim()
       : "";
 
     // Check if productPlace includes receivedPlace or vice versa
     return productPlace.includes(receivedPlace) || receivedPlace.includes(productPlace);
   }
   return false;
 });
 
 return (
   <>
     <Modal show={showPopup} onHide={() => setShowPopup(false)}>
       <Modal.Header closeButton>
         <Modal.Title>Find Your Nearest Products</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Test2
           handleDataSend={handleDataReceive}
           handleCloseModal={handleCloseModal}
         />
       </Modal.Body>
     </Modal>
 
     {!showPopup && (
       <div className="product-list mt-5">
         {filteredByPlaceName.length > 0 ? (
           filteredByPlaceName.map((product) => (
             <div
               key={product._id ? product._id : product.id}
               className="card"
               style={{ width: "20rem", margin: "10px" }}
               id={
                 product.quantity && product.quantity !== 0
                   ? "in-stock"
                   : "out-of-stock"
               }
             >
               <div>
                 <img
                   src={
                     product._id
                       ? `http://localhost:8000/${product.image}`
                       : product.image
                   }
                   alt={product.name}
                   className="card-img-top"
                   style={{
                     objectFit: "cover",
                     maxWidth: "400px",
                     maxHeight: "300px",
                     minWidth: "400px",
                     minHeight: "300px",
                     width: "100%",
                     height: "100%",
                   }}
                   onClick={() => handleProductClick(product)}
                 />
                 <
                     <button
                       className="add-to-cart-btn"
                       onClick={() => addToCart(product._id, product.name)}
                     >
                       Add to Cart
                     </button>
                     {/* <Link to={`/Productfb/${product._id}`}>
                       <button
                         className="add-to-cart-btn ml-3"
                         onClick={() => addToCart(product._id, product.name)}
                       >
                         Raiting
                       </button>
                     </Link> */}
                   </div>
                 </div>
               </div>
 
               {!product.quantity || product.quantity === 0 ? (
                 <p className="overlay-text">Out Of Stock</p>
               ) : null}
             </div>
           ))
         ) : (
           <p>No products available for {placename}</p>
         )}
       </div>
     )}
   </>
 );
}
 
 