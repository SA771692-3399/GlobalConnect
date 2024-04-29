import React, { useState } from 'react'
import './Topnav.css';
import { Link } from 'react-router-dom';
export default function Seller() {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const buttonStyle = {
      color: isHovered ? "white" : "#7e5888",
      background: isHovered ? "#7e5888" : "white",
    };
  return (
    <div className='w-full h-auto p-5 ' style={{background:"#7e5888"}}>
   <div className='container text-center text-white'>
   We pride ourselves on being a dynamic team comprising dedicated sellers, local business owners, and enthusiastic users of our website. Together, we create a vibrant marketplace where authentic Indian products and services flourish, connecting sellers with a diverse audience passionate about Indian culture. Our collaborative spirit fuels our success as a great business, fostering meaningful interactions and enriching experiences for all involved.
   </div>
   <div className='container text-center mt-5 text-white'>
   Additionally, offer a delightful array of Indian snacks, enticing customers with flavors that evoke nostalgia and culinary delight. As a seller, tap into a vast market of enthusiasts eager to explore and indulge in the vibrant world of Indian fashion and cuisine. Elevate your business by connecting with a diverse audience passionate about experiencing the best of Indian culture through your products.
   </div>
   <div className='container text-center mt-5 '>
    <Link to="/seller-register">
   <button
      type="button"
      className="btn btn-lg"
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Start Selling
    </button>
    </Link>
   </div>
    </div>
  )
}
