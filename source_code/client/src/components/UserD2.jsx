import React, { useState } from "react";
import LocalCata from "./LocalCata";
import { MdFeedback } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function UserD2({
  selectedCategory,
  filteredProducts,
  handleProductClick,
  addToCart,
  addToWishList,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBySearch = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByCategory = filteredBySearch.filter(
    (product) => product.category !== "Local business"
  );

  return (
    <div style={{ margin: "0", padding: "0" }}>
      {selectedCategory !== "Local business" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filteredByCategory.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {filteredByCategory.map((product) => (
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
                          ? `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${product.image}`
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
                      onClick={() => {
                        handleProductClick(product);
                        window.scroll({top: 0, left: 0, behavior: 'smooth' })
                      }}
                    />
                    <div className="card-body">
                      <div style={{ display: "inline-block" }}>
                        <h5
                          className="card-text"
                          style={{ color: "gray", fontSize: "16px" }}
                        >
                          {product.name}{" "}
                          <span
                            style={{
                              right: "0",
                              position: "absolute",
                              paddingRight: "10px",
                              fontSize: "12px",
                              color: "skyblue",
                            }}
                          >
                            {product.category}
                          </span>
                        </h5>
                        <p
                          style={{
                            display: "inline",
                            right: "0",
                            position: "absolute",
                            paddingRight: "10px",
                            marginTop: "-1rem",
                          }}
                        >
                          ${product?.productPrices?.[0]?.price}{" "}
                          <span style={{ color: "#7e5888", fontSize: "12px" }}>
                            {product.sizeProduct} Size
                          </span>
                        </p>
                        <h5
                          className="card-text"
                          style={{ color: "gray", fontSize: "16px" }}
                        >
                          <span
                            style={{
                              right: "0",
                              position: "absolute",
                              paddingRight: "10px",
                              fontSize: "12px",
                              marginTop: "10px",
                            }}
                          >
                            {" "}
                            {product.quantity} in Stock
                          </span>
                        </h5>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "1rem",
                        }}
                      >
                     
                        <Link to={`/Productwish/${product._id}`}>
                          <CiHeart size={25} color="#7e5888" />
                        </Link>
                      </div>
                      <br />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "-1rem",
                        }}
                      >
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
                          Rate the Product
                        </button>
                        </Link> */}
                      </div>
                    </div>
                  </div>
                  {!product.quantity || product.quantity === 0 ? (
                    <p className="overlay-text">Out Of Stock</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p>No products found.</p>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
