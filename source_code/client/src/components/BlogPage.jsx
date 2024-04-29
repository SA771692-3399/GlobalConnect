import React from "react";
import Topnav from "./Topnav";
import Slider from "./Slider";
import MainNav from "./MainNav";
import Footer from "./Footer";
import Blogs from "./Blogs";
import HeadText from "./HeadText";

import './Topnav.css';

export default function BlogPage() {
  const data = [
    {
      t1: "Our Blogs",
      t2: "Lets Explore Our Blogs",
      t3: "As a local business, we take pride in offering a delectable array of traditional Indian food, crafted with authentic recipes passed down through generations. ",
    },
  
  ];
  return (
    <>
      <Topnav />
      <MainNav />
      <Slider />
      <div className="headText">
      <HeadText t1={data[0].t1} t2={data[0].t2} t3={data[0].t3} />
      <Blogs />
      </div>
      
    
      <Footer />
    </>
  );
}
