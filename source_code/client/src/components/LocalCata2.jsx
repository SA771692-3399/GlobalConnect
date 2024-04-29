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
                        {product.price}${" "}
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
                      <Link to={`/Productfb/${product._id}`}>
                        <button
                          className="add-to-cart-btn ml-3"
                          onClick={() => addToCart(product._id, product.name)}
                        >
                          Raiting
                        </button>
                        </Link>
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
