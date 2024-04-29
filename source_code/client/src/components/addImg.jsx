import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiDeleteOutline } from "react-icons/ti";
import axios from "axios";
import './addImg.css';

function AddImg({ productId }) {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({});
  const [productImages, setProductImages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch product images on component mount
    fetchProductImages();
  }, []);

  const handleDeleteProductImg = async (imageId) => {
    try {
      const response = await axios.delete(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/productsImg/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Image deleted:', response.data);

      // Refresh product images after deletion
      fetchProductImages();
      notifySuccess("Image deleted successfully.");
    } catch (error) {
      console.error('Error deleting image:', error.message);
      notifyError("Failed to delete image.");
    }
  };

  const fetchProductImages = async () => {
    try {
      const res = await axios.get(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/getallproductimgs/${productId}`);
      if (res.data.success) {
        setProductImages(res.data.productImages);
      } else {
        console.error("Failed to fetch product images:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching product images:", error.message);
    }
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const validateForm = () => {
    let isValid = true;

    if (!name.trim() || !formData.image) {
      notifyError("Name and image are required");
      isValid = false;
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      notifyError("No token found");
      return;
    }

    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", name);
        formDataToSend.append("productID", productId);
        formDataToSend.append("image", formData.image);

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };

        const res = await axios.post(
          `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/productsImage/${productId}`,
          formDataToSend,
          { headers }
        );

        if (res.data.success) {
          notifySuccess("Product image added successfully.");
          // Refresh product images after upload
          fetchProductImages();
        } else {
          notifyError(res.data.message || "Failed to add product image.");
        }
      } catch (error) {
        console.error("Error adding product image:", error);
        notifyError(
          "Failed to add product image. Please try again later."
        );
      }
    }
  };

  return (
    <div className="registration-form" style={{ margin: "15px" }}>
  
      <form onSubmit={handleSubmit}>
      <div style={{display:'flex', justifyContent:"center"}}>ADD IMAGE</div>
        <div className="register-logo">
          <div style={{ color: "white", padding: "5px" }}>Add Picture</div>
        </div>
        <div className="form-group" style={{ marginTop: "1rem" }}>
        <span class="label label-default ml-1 mt-5">Name</span>
          <input
            type="text"
            className="form-control item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="productImage">Upload Image:</label>
          <input
            type="file"
            id="productImage"
            name="image"
            className="form-control item"
            onChange={handleInputChange}
            required
          />
        </div>
        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Selected"
            style={{ width: "100px", height: "100px" }}
          />
        )}
        <div className="form-group">
          <button type="submit" className="btn btn-block create-account" style={{ background: "#7e5888" }}>
            Submit
          </button>
        </div>
      </form>

      <section className="container" style={{ marginTop: "1rem" }}>
        <div className="row">
          {productImages.map((image, index) => (
            <div className="col-lg-4 col-md-6 mb-4" key={image._id}>
              <div className="bg-image hover-overlay ripple shadow-1-strong rounded position-relative">
                <img src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${image.image}`} alt="" className="w-100 h-auto img-cover" />
                <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 100}}>
                  <TiDeleteOutline size={30} style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleDeleteProductImg(image._id)} />
                </div>
                <div className="mask d-flex justify-content-center align-items-center">
                  <div className="text-white position-absolute top-50 start-50 translate-middle">{image.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AddImg;
