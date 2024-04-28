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
 
            
 )
}
 
 