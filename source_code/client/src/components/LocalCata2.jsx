import React, { useState } from "react";
import "./Cata.css";
import { Modal, Button } from "react-bootstrap";
import { MdFeedback } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
const googleApiKey = "AIzaSyCJuXjrVG16GdwXjHaktlXhO_A_UsR-HMk";
export default function LocalCata({
 filteredProducts,
 handleProductClick,
 addToCart,
}) {
 const [placename, setPlaceName] = useState("");
 const [showPopup, setShowPopup] = useState(true);
 
 const handleInputChange = (e) => {
   setPlaceName(e.target.value);
 };
 
 const handlePopupSubmit = (e) => {
   e.preventDefault(); // Prevent the default form submission behavior
   setShowPopup(false);
 };
 
 const filteredByPlaceName = filteredProducts.filter(
   (product) =>
     product.placename &&
     product.placename.toLowerCase().includes(placename.toLowerCase())
 );
 
 return (
   <>
     <Modal show={showPopup} onHide={() => setShowPopup(false)}>
       <Modal.Header closeButton>
         <Modal.Title>Find Your Nearest Products</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <form role="form" onSubmit={handlePopupSubmit}>
           <fieldset>
             <legend style={{ fontSize: "12px" }}>
               Must enter your full address to find your nearest products
             </legend>
             <div className="form-group col-xs-6">
               <label htmlFor="name">Place Name: *</label>
               <input
                 type="text"
                 className="form-control"
                 id="name"
                 name="placename"
                 value={placename}
                 onChange={handleInputChange}
                 style={{ fontSize: "12px" }}
                 required
               />
             </div>
           </fieldset>
           <Button variant="default" type="submit">
             SEARCH
           </Button>
         </form>
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
 
 