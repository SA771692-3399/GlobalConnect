import React, { useState } from "react";
import "./Combo.css";
import { CgWebsite } from "react-icons/cg";
import { FaCss3Alt } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import { FaBootstrap } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { AiFillCustomerService } from "react-icons/ai";
import { GiFoodTruck } from "react-icons/gi";
import { GiAmpleDress } from "react-icons/gi";
import { PiBowlFood } from "react-icons/pi";
import { GiCardPickup } from "react-icons/gi";
import { FaTruckPickup } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
const images = [
  <AiFillCustomerService size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <GiFoodTruck size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <GiAmpleDress size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <PiBowlFood  size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <GiCardPickup size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <FaTruckPickup size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
  <MdPayments size={40} color="#ba81ad" style={{cursor:"pointer"}}/>,
];

export default function Combo() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const getContentText = (index) => {
    switch (index) {
      case 0:
        return "Customer Support";
      case 1:
        return "Catering Services";
      case 2:
        return "Indian Traditional Dress";
      case 3:
        return "Snaks";
      case 4:
        return "Pickup";
      case 5:
        return "Home Delevry";
      case 6:
        return "Online & Cahe Payment";
        
      default:
        return "Online Selling Purchasing";
    }
  };

  return (
    <div className="bodys">
      <div className="container2">
        <div className="icon">
          {images.map((image, index) => (
            <div
              key={index}
              className={`imgBx ${index === activeIndex ? "active" : ""}`}
              style={{ "--i": index , cursor:"pointer"}}
              data-id={`content${index + 1}`}
              onClick={() => handleClick(index)}
            >
              <div className="ico" style={{marginBottom:"56px", marginLeft:'2px', cursor:'pointer'}}>{image}</div>
            </div>
          ))}
        </div>
        <div className="content">
          {images.map((image, index) => (
            <div
              key={index}
              className={`contentBx ${index === activeIndex ? "active" : ""}`}
              id={`content${index + 1}`}
            >
              <div className="carde">
                <div className="imgBx">
                  <div className="icos" style={{marginTop:".5rem", marginLeft:".5rem"}}>{images[activeIndex]}</div>
                </div>
                <div className="textBx">
                  <h6>{getContentText(activeIndex)}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}