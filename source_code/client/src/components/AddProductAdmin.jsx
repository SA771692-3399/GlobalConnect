import React from 'react'

export default function AddProductAdmin({handleSubmit,formData,handleInputChange}) {
  return (
    <div>
       <div className="add-product-form-container">
            <h1>{formData.name ? "Update Product" : "Add Product"}</h1>
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
                <select
                  id="sizeProduct"
                  name="sizeProduct"
                  value={formData.sizeProduct}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select a{" "}
                    {formData.category === "Local business"
                      ? "Tray Size"
                      : "Product Size"}
                  </option>
                  {formData.category === "Local business" ? (
                    <>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </>
                  ) : (
                    <>
                      <option value="sm">sm</option>
                      <option value="md">md</option>
                      <option value="lg">lg</option>
                      <option value="xl">xl</option>
                      <option value="2xl">2xl</option>
                      {/* Note: Changed "Pink" to lowercase */}
                    </>
                  )}
                </select>
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
                      : `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${formData.image}`
                  }
                  alt="Selected"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <button type="submit">
                {formData.name ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
    </div>
  )
}
