import React from "react";
import Topnav from "./Topnav";
import Slider from "./Slider";
import MainNav from "./MainNav";
import Footer from "./Footer";
import HeadText from "./HeadText";
import './Topnav.css';
import Blogs1 from "./Blogs1";
import Blogs2 from "./Blogs2";
import Blogs3 from "./Blogs3";
import Blogs4 from "./Blogs4";
export default function Products() {
  const data = [
    {
      t1: "Latest Offers",
      t2: "Lets Explore Our Blogs",
      t3: "As a local business owner, connect with a community of food enthusiasts eager to savor the rich and diverse tastes of Indian culture. Elevate your catering business by offering a unique dining experience that celebrates the essence of Indian culinary heritage.",
    },
    {
      t1: "Clothing Products",
      t2: "Lets Explore Our Blogs",
      t3: "Discover our exquisite collection of Indian dresses, featuring vibrant colors and intricate designs that showcase the beauty of traditional attire. Explore timeless elegance and cultural richness in every garment.",
    },
    {
      t1: "Snaks Products",
      t2: "Lets Explore Our Snaks",
      t3: "Savor the authentic flavors of India with our delicious range of traditional snacks, crafted with premium ingredients and age-old recipes. Experience the perfect blend of spices and textures in every bite.",
    },
    {
      t1: "Catering Items",
      t2: "Get familiar with us",
      t3: "Delight your guests with our exquisite Indian catering items, featuring aromatic curries, savory appetizers, and delectable sweets. Experience the richness of Indian cuisine, meticulously prepared to tantalize every palate.",
    },
    
  ];
  return (
    <>
      <Topnav />
      <MainNav />
      <Slider />
      <div className="headText"></div>
      <HeadText t1={data[0].t1} t2={data[0].t2} t3={data[0].t3} />
      <Blogs1 />
      <HeadText t1={data[1].t1} t2={data[1].t2} t3={data[1].t3} />
      <Blogs2 />
      <HeadText t1={data[2].t1} t2={data[2].t2} t3={data[2].t3} />
      <Blogs4 />
      <HeadText t1={data[3].t1} t2={data[3].t2} t3={data[3].t3} />
      <Blogs3 />
     

      <Footer />
    </>
  );
}
