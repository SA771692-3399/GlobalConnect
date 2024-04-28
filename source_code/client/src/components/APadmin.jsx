import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: 'Double Extra Large' },
];
export default function APadmin({ editingProduct, setEditingProduct }) {
  const initialFormData = {
    name: '',
    price: 0,
    category: '',
    spice: '',
    sizeProduct: [],
    description: '',
    quantity: 0,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [errors, setErrors] = useState({}); // State for validation errors
  const token = localStorage.getItem('token');

  if (!token) throw new Error('No token found');

  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  useEffect(() => {
    if (editingProduct) {
      fetchProductDetails();
    }
  }, [editingProduct]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/admin-seller/products/${editingProduct}`);
      const { data } = response;
      setFormData({
        name: data.name || '',
        price: data.price || 0,
        category: data.category || '',
        spice: data.spice || '',
        sizeProduct: data.sizeProduct || [],
        description: data.description || '',
        quantity: data.quantity || 0,
        image: null,
      });
      setSelectedSizes(data.sizeProduct || []);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSizeChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizeProduct: selectedOptions.map((option) => option.value),
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (formData.name.trim() === '') {
      newErrors.name = 'Product Name is required';
      isValid = false;
    }

    // Add validations for other fields here

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Form validation failed, do not submit
      return;
    }

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8000/admin-seller/products/${editingProduct}`, formData);
        alert('Product updated successfully!');
      } else {
        await axios.post('http://localhost:8000/admin-seller/products', formData);
        alert('Product added successfully!');
      }
      setFormData(initialFormData);
      setSelectedSizes([]);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product. Please try again.');
    }
  };

  return (
    <div>
      <div className="add-product-form-container">
        <h1>{editingProduct ? "Update Product" : "Add Product"}</h1>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="productPrice">Product Price:</label>
            <input
              type="number"
              id="productPrice"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Local business">Local business</option>
            </select>
          </div>
          <div>
            <label htmlFor="spice">
              {formData.category === "Local business" ? "Spice" : "Color"}
            </label>
            {formData.category === "Local business" ? (
              <select
                id="spice"
                name="spice"
                value={formData.spice}
                onChange={handleInputChange}
              >
                <option value="">Select a Spice</option>
                <option value="mild">Mild</option>
                <option value="regular">Regular</option>
                <option value="spicy">Spicy</option>
              </select>
            ) : (
              <input
                id="spice"
                name="spice"
                value={formData.spice}
                onChange={handleInputChange}
              />
            )}
          </div>
          <div>
            <label htmlFor="sizeProduct">
              {formData.category === "Local business"
                ? "Tray Size"
                : "Product Size"}
            </label>
            <Select
              options={sizeOptions}
              isMulti
              value={selectedSizes}
              onChange={handleSizeChange}
            />
          </div>
          <div>
            <label htmlFor="productDescription">Product Description:</label>
            <textarea
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="productQuantity">Quantity:</label>
            <input
              type="number"
              id="productQuantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="productImage">Upload Image:</label>
            <input
              type="file"
              id="productImage"
              name="image"
              onChange={handleInputChange}
              required={formData.image ? false : true}
            />
          </div>
          {formData.image && (
            <img
              src={
                formData.image && typeof formData.image === "object"
                  ? URL.createObjectURL(formData.image)
                  : `http://localhost:8000/${formData.image}`
              }
              alt="Selected"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <button type="submit">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}


