import React, { useState } from 'react'
import './Topnav.css';
import { Link } from 'react-router-dom';
export default function Seller2() {
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
    
Embark on an exciting journey as a local business owner specializing in catering authentic Indian food! Join our platform to showcase your culinary expertise and passion for Indian cuisine. With a focus on traditional recipes and quality ingredients, create a menu that delights and captivates customers with flavors from across India.
   </div>
   <div className='container text-center mt-5 text-white'>
   As a local business owner, connect with a community of food enthusiasts eager to savor the rich and diverse tastes of Indian culture. Elevate your catering business by offering a unique dining experience that celebrates the essence of Indian culinary heritage.   </div>
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
