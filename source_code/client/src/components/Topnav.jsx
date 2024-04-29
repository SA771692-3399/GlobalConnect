import React from "react";
import './Topnav.css'
import { IoLogoFacebook } from "react-icons/io5";
import { GrInstagram } from "react-icons/gr";
import { FaTwitter } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
export default function Topnav() {
  return (
    <div>
      <nav className="topnav ">
       <div className="navDiv">
       <a  href="https://www.facebook.com/share/qXafe6uBhtRPzZA1/?mibextid=qi2Omg">
        <IoLogoFacebook size={20} className="navIcons"/>
        </a>
        <a  href="https://whatsapp.com/channel/0029VaX2KoCKGGGDwK5OL71h">
        <FaWhatsapp  size={20} className="navIcons"/>
        </a>
     
        <a  href="https://www.instagram.com/_global_connect_business? igsh=azNuZ2U4c3Yxbnd4&utm_source=qr">
        <GrInstagram size={18} className="navIcons"/>
        </a>
        <a  href="https://twitter.com/GlobalConnectTM">
        <FaTwitter  size={20} className="navIcons"/>
        </a>
      
     
       </div>

      </nav>
    </div>
  );
}