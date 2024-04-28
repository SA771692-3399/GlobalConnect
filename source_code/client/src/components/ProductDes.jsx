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
  
 
  );
}


