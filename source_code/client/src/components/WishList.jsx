import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishList = ({ addToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate(); // Use useNavigate for navigation
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const response = await axios.get(
          `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/listwishlist/${userID}`
        );
        setWishlistItems(response.data.wishlistItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userID]); // Add userID to dependency array

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      await axios.delete(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/deletewishlist/${itemId}`);
      notifySuccess("Item deleted from Wishlist");
      // After successful deletion, fetch updated wishlist data
      const response = await axios.get(
        `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/listwishlist/${userID}`
      );
      setWishlistItems(response.data.wishlistItems);
    } catch (error) {
      console.error("Error deleting item from wishlist:", error);
      notifyError("Failed to delete item from Wishlist. Please try again later.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }} className="mt-5 mb-3">
        WishList
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : wishlistItems.length === 0 ? (
        <p>Wishlist is Empty</p>
      ) : (
        <div className="container">
          <table className="table">
            {/* Table header */}
            <thead style={{ backgroundColor: "#7e5888" }}>
              <tr style={{ backgroundColor: "#7e5888" }}>
                <th scope="col">#</th>
                <th scope="col">Picture</th>
                <th scope="col">Name</th>
                <th scope="col">Size</th>
                <th scope="col">Price</th>
                <th scope="col">ADD to Cart</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            {/* Table body for existing wishlist items */}
            <tbody>
              {wishlistItems.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={
                        item._id
                          ? `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${item.image}`
                          : item.image
                      }
                      alt={item.name}
                      style={{ width: "5rem" }}
                      className="card-img-top"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.productPrices?.[0]?.size}</td>
                  <td>${item.productPrices?.[0]?.price}</td>
                  <td>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item.productID, item.name, item?.productPrices?.[0]?.size)}
                    >
                      Add to Cart
                    </button>
                  </td>
                  <td>
                    <MdDelete
                      size={30}
                      color="#7e5888"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer /> {/* Render ToastContainer for notifications */}
    </div>
  );
};

export default WishList;
