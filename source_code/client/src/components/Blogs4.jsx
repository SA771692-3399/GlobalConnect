import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BlogsSlider.css"; // Import CSS file for custom styles
import { Link, useNavigate } from "react-router-dom";
const blogs = [
  {
    id: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaWk2eRhL4NxMezdXhL2MG_MpkO8gQhAbXMw&usqp=CAU",
    title: "Alo Bhujia",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo .",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkIePcr6vcDlAtmB2HgWBIopV55ipQkXNa4A&usqp=CAU",
    title: "Channay",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo .",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAHq3Tumkv61Xu2ML4DMm3ndZnRv8_0z9i7n9_sYtNxkdSB9MK1AwxKYg-a04MpciRjpU&usqp=CAU",
    title: "Freeky Frize",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo ",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQngpdBh64wkkth3hKOn5PjQfcHe0h2xFzLsQ&usqp=CAU",
    title: "Kurkure",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa--OErjgQs3e8amWGR_lHGSPm03n06-Q2xQ&usqp=CAU",
    title: "Craks",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJOofDInYh1Zprwt1kBxZ51bPx5l8H_L-FuA&usqp=CAU",
    title: "Chattka Namkeen",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },

  // Add more blog objects here
];

export default function Blogs4() {
  const nav = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [zoomedCard, setZoomedCard] = useState(null); // State to track which card is zoomed
  const descriptionWordsLimit = 20;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleZoom = (blogId) => {
    setZoomedCard(zoomedCard === blogId ? null : blogId); // Toggle zoom state for the clicked card
  };

  const renderDescription = (blog) => {
    if (
      showFullDescription ||
      blog.description.split(" ").length <= descriptionWordsLimit
    ) {
      return blog.description;
    } else {
      const words = blog.description
        .split(" ")
        .slice(0, descriptionWordsLimit)
        .join(" ");
      return `${words} ...`;
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  // Check if localStorage is empty
  const addToCart = () => {
    // Check if localStorage is empty
    const cartItems = localStorage.getItem("cartItems");
    if (!cartItems) {
      // Redirect to login page if localStorage is empty
      nav.push("/login");
    } else {
      nav.push("/user");
      // Handle adding to cart logic
      // For example:
      // Add the item to cart and update localStorage
    }
  };
  nav("/login", { replace: true });
  return (
  
    <div style={{ alignItems: "center" }}>
      <Slider {...settings}>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <div
              className={`card ${zoomedCard === blog.id ? "zoomed" : ""}`}
              style={{ width: "18rem", margin: "10px" }}
              onClick={() => toggleZoom(blog.id)} // Toggle zoom on click
            >
              {blog.imageUrl && (
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                  style={{
                    objectFit: 'cover',
                    maxWidth: '300px',
                    maxHeight: '200px',
                    minWidth: '200px',
                    minHeight: '200px',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}

              <div className="card-body" style={{color:"gray", fontSize:"16px"}}>
                <div style={{ display: "inline-block" }}>
                  <h5 className="card-text">
                    {blog.title} <span style={{right:"0", position:"absolute" , paddingRight:"10px", fontSize:"12px", color:"skyblue"}}>{blog.off}</span>
                  </h5>
                  <p style={{ display: "inline", right:"0", position:"absolute" , paddingRight:"10px", marginTop:"-1rem"}}>
                    {blog.afterOff}{" "}
                    <span style={{ textDecoration: "line-through" , color:"#7e5888", fontSize:"12px"}}>
                      {blog.total}
                    </span>
                  </p>
                </div>
              
              </div>
              <div style={{display:"flex", justifyContent:"center", marginBottom:"15px" }}><button type="button" class="btn btn-secondary btn-sm" style={{background:"#7e5888"}} >ADD TO CART</button></div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
