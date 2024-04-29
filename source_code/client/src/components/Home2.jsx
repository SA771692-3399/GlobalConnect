import React from "react";
import Topnav from "./Topnav";
import Slider from "./Slider";
import MainNav from "./MainNav";
import Footer from "./Footer";
import Blogs1 from "./Blogs1";
import HeadText from "./HeadText";
import Getfeedback from "./Getfeedback";
import './Topnav.css';
import About from "./About";
import Seller from "./Seller";
import Seller2 from "./Seller2";
export default function Home2() {
  const data = [
    {
      t1: "Latest Offers",
      t2: "Enjoy Our Latest Offers",
      t3: "As a local business owner, connect with a community of food enthusiasts eager to savor the rich and diverse tastes of Indian culture. Elevate your catering business by offering a unique dining experience that celebrates the essence of Indian culinary heritage.",
    },
    {
      t1: "Become a Seller",
      t2: "Our Seller is Our Family",
      t3: "",
    },
    {
      t1: "Become a Local Business Owner",
      t2: "Achieve the opportunity to sell your Catering Dishes.",
      t3: "",
    },
    {
      t1: "About Us",
      t2: "Get familiar with us",
      t3: "We pride ourselves on being a dynamic team comprising dedicated sellers, local business owners, and enthusiastic users of our website. Together, we create a vibrant marketplace where authentic Indian products and services flourish, connecting sellers with a diverse audience passionate about Indian culture. Our collaborative spirit fuels our success as a great business, fostering meaningful interactions and enriching experiences for all involved.",
    },
    {
      t1: "Our Services",
      t2: "We are Providing Services",
      t3: "Experience the essence of Indian culture right at your doorstep with our specialized services. We offer homedelivery of traditional Indian cuisine, bringing the flavors of India to your table. Our local catering services cater to the nearest areas, ensuring that you get authentic Indian dishes prepared with love and expertise. From delectable snacks to hearty meals, we showcase the rich diversity of Indian culinary traditions, allowing you to savor every bite while immersing yourself in the vibrant flavors and spices that define Indian cuisine. Explore our offerings and let us take you on a culinary journey that celebrates the essence of Indian culture and hospitality.      ",
    },
    {
      t1: "Feedback",
      t2: "What Our Customers Says About Us",
      t3: "Our clients rave about our exceptional services, praising the authenticity and quality of our Indian cuisine. They commend our prompt homedelivery and local catering, highlighting the delightful experience of enjoying traditional Indian flavors in the comfort of their homes or events.",
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
      <Seller/>
      <HeadText t1={data[3].t1} t2={data[3].t2} t3={data[3].t3} />
      <About/>
      <HeadText t1={data[2].t1} t2={data[2].t2} t3={data[2].t3} />
      <Seller2/>
  
      <HeadText t1={data[4].t1} t2={data[4].t2} t3={data[4].t3} />
      {/* <div
        className="container mt-5 ourservice"
        
      >
        <div className="aboutText">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia atque
          eligendi illum exercitationem a? Quasi nihil quidem sit, nostrum
          molestias ipsum optio earum saepe quae et pariatur placeat distinctio.
          Suscipit laborum in eaque similique, ducimus, culpa cupiditate illo
          dolores voluptas quidem ratione ipsam ipsum excepturi nihil provident
          aperiam doloremque officia. Mollitia molestias veniam voluptatem
          earum!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia atque
          eligendi illum exercitationem a? Quasi nihil quidem sit, nostrum
          molestias ipsum optio earum saepe quae et pariatur placeat distinctio.
          Suscipit laborum in eaque similique, ducimus, culpa cupiditate illo
          dolores voluptas quidem ratione ipsam ipsum excepturi nihil provident
          aperiam doloremque officia. Mollitia molestias veniam voluptatem
          earum!
        </div>
        <div>
          <Combo />
        </div>
      </div> */}
      <HeadText t1={data[5].t1} t2={data[5].t2} t3={data[5].t3} />
      <Getfeedback />
      <Footer />
    </>
  );
}
