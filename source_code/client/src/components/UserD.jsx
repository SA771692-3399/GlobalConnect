import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function UserD({
  selectedCategory,
  filteredProducts,
  handleProductClick,
  addToCart,
  handleAddToWishlist,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const descriptionWordsLimit = 10;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBySearch = filteredProducts.filter((product) =>
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.price && product.price.toString().includes(searchTerm.toLowerCase())) ||
    (product.quantity && product.quantity.toString().includes(searchTerm.toLowerCase())) ||
    (product.spice && typeof product.spice === 'string' && product.spice.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && typeof product.category === 'string' && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.sizeProduct && typeof product.sizeProduct === 'string' && product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredByCategory = filteredBySearch.filter(
    (product) => product.category !== "Local business"
  );

  const renderDescription = (product) => {
    if (
      product.description.split(" ").length <= descriptionWordsLimit
    ) {
      return product.description;
    } else {
      const words = product.description
        .split(" ")
        .slice(0, descriptionWordsLimit)
        .join(" ");
      return `${words} ...`;
    }
  };

  return (
    <div>
      <h4 className="mt-5 ml-5">Dashboard - {selectedCategory}</h4>

      {selectedCategory !== "Local business" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ height: "2rem", width: "100%", borderRadius: "10px", border: "gray", padding: "5px" }}
            />
          
          </div>
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
                      onClick={() => handleProductClick(product)}
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
                          onClick={() => addToCart(product._id, product.name, product?.productPrices?.[0]?.size)}
                        >
                          Add to Cart
                        </button>
                        {/* <Link to={`/Productfb/${product._id}`}>
                        <button
                          className="add-to-cart-btn ml-3"
                          onClick={() => addToCart(product._id, product.name)}
                        >
                          Rate this product
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
      )}
    </div>
  );
}
