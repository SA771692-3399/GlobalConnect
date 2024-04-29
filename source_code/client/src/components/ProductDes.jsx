import React, { useState } from "react";
import { TiArrowLeftThick } from "react-icons/ti";
import Galry from "./Galry";
import "./Galry";
import { TfiWorld } from "react-icons/tfi";
import { TbMoodConfuzed } from "react-icons/tb";
import UserD2 from "./UserD2";
import Blogs5 from "./Blogs5";
import Footer from "./Footer";
import { FaHandsHelping } from "react-icons/fa";
import { Link } from "react-router-dom";
import Raiting from "./Raiting";
import SellerP from "./SellerP";
export default function ProductDes({
  handleBackToProducts,
  selectedProduct,
  addToCart,
  selectedCategory,
  filteredProducts,
  handleProductClick,
  addToWishList,
}) {
  console.log("🚀 ~ selectedProduct:", selectedProduct)
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizeProduct[0].split(",")?.[0] || "");

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const sizeOptions = selectedProduct?.category?.toLowerCase() == "food" ? 
  ['1LB', '2LB', '5LB'] : ["SM", "MD", "LG", "XL", "XXL"];
  
  return (
    <div style={{ background: "white" }}>
      <button className="back-arrow-btn m-2" onClick={handleBackToProducts}>
        <TiArrowLeftThick onClick={handleBackToProducts} />
      </button>
      <br></br>
      <div id="formic">
        <div>
          <Galry
            handleBackToProducts={handleBackToProducts}
            selectedProduct={selectedProduct}
            addToCart={addToCart}
          />
        </div>
        <div>
          <div
            className="card"
            id="forms"
            style={{ border: "none", boxShadow: "none" }}
          >
            <div className="card-body">
              <h5 className="card-title">Product Name: {selectedProduct.name}</h5>
              <p>Raiting:   <Raiting productID = {selectedProduct._id}/></p>
              <h6 className="card-subtitle mb-2 text-muted">
                Price: ${selectedProduct?.productPrices?.find(v => v?.size == selectedSize)?.price}
             
              </h6>
             
              <hr></hr>
              <div>
                <lable>Size</lable>
                <div></div>

                <div style={{fontSize:"10px", color:"gray"}}>
                Note: For clothing sizes, the sizes are the same. However, for food and catering sizes, consider box , tray,  packet size or pounds. In SM, it is considered as half a pound; in MD, 1 pound; in LG, 2 pounds; and so on.
                </div>
                <div>
                  {selectedProduct.sizeProduct[0]
                    ? selectedProduct.sizeProduct[0]
                        .split(",")
                        .map((value, index) => {
                          const trimmedValue = value.trim();
                          if (sizeOptions.includes(trimmedValue)) {
                            return (
                              <button
                                key={index}
                                type="button"
                                className={`btn btn-outline-secondary m-1 ${
                                  selectedSize === trimmedValue ? "active" : ""
                                }`}
                                onClick={() => handleSizeClick(trimmedValue)}
                              >
                                {trimmedValue}
                              </button>
                            );
                          }
                          return null;
                        })
                    : null}

                  {sizeOptions.map((size) =>
                    !selectedProduct.sizeProduct[0]?.includes(size) ? (
                      <button
                        key={size}
                        type="button"
                        className="btn btn-outline-secondary m-1 bg-dark text-white disabled"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, white 10%, transparent 10%, transparent 20%, white 20%, white 30%, transparent 30%, transparent 40%, white 40%, white 50%, transparent 50%, transparent 60%, white 60%, white 70%, transparent 70%, transparent 80%, white 80%, white 90%, transparent 90%, transparent 100%)",
                          backgroundSize: "1px 100%",
                          pointerEvents: "none", // Disable pointer events
                          opacity: 0.6, // Reduce opacity to indicate it's disabled
                        }}
                        disabled // This makes the button disabled
                      >
                        {size}
                      </button>
                    ) : null
                  )}
                </div>
              </div>
              {selectedProduct.category === "Local business" 
              // || selectedProduct.category === "Food"
               ? (
                <>
                  <div className="mt-3">
                    <h6 className="card-subtitle mb-2 text-muted">
                     Spice Level: <span>{selectedProduct.spice}</span>
                    </h6>
                    {/* <button
                      type="button"
                      className="btn btn-outline-secondary m-1"
                    >
                      {selectedProduct.spice}
                    </button> */}
                   
                  
                  </div>
                </>
              ) : (
                ""
              )}

              <hr></hr>
              <div>
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary"
                    style={{ background: "#7e5888" }}
                    type="button"
                    onClick={() =>
                      selectedProduct.quantity && selectedProduct.quantity !== 0
                        ? addToCart(selectedProduct._id, selectedProduct.name, selectedSize)
                        : null
                    }
                  >
                    ADD TO CART
                  </button>

                  <button
                    style={{ background: "gray" }}
                    class="btn btn-primary"
                    type="button"
                  >
                    <Link
                      to={`/Productwish/${selectedProduct._id}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      {" "}
                      ADD TO WISHLIST{" "}
                    </Link>
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <div style={{ display: "flex" }}>
                  <div className="mr-2">
                    <TfiWorld size={30} />
                  </div>
                  <div>
                    <p style={{ marginTop: "-.3rem", fontSize: "14px" }}>
                      WorldWide Shipping
                    </p>
                    <p
                      style={{
                        marginTop: "-1rem",
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      Free Shipping over $100 (USA only)
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex" }}>
                  <div className="mr-2">
                    <TbMoodConfuzed size={30} />
                  </div>
                  <div>
                    <p style={{ marginTop: "-.3rem", fontSize: "14px" }}>
                      Confused about sizing?
                    </p>
                    <p
                      style={{
                        marginTop: "-1rem",
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      Not to worry! Click Our Size Guide{" "}
                      <a href="/">Call +1 (832) 648 8374</a>
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex" }}>
                  <div className="mr-2">
                    <FaHandsHelping size={30} />
                  </div>
                  <div>
                    <p style={{ marginTop: "-.3rem", fontSize: "14px" }}>
                      Need Help?
                    </p>
                    <p
                      style={{
                        marginTop: "-1rem",
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      Call +1 (832) 648 8374 OR WhatsApp Us
                    </p>
                  </div>
                </div>
              </div>
              <p className="card-text">
                Description: {selectedProduct.description}
              </p>
            </div>
            <SellerP PID = {selectedProduct.seller._id}/>
          </div>
         
        </div>
     
      </div>
     
   
      <Blogs5 selectedProduct={selectedProduct} />

      <div>
        <div
          className="alert"
          style={{ backgroundColor: "#7e5888", color: "white" }}
        >
          Similar Products
        </div>
        <UserD2
          filteredProducts={filteredProducts}
          handleProductClick={handleProductClick}
          addToCart={addToCart}
          addToWishList={addToWishList}
        />
      </div>
      <Footer />
    </div>
  );
}
