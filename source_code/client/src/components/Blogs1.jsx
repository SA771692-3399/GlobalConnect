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
      "https://media.istockphoto.com/id/1911602322/photo/indian-woman-fashion-dress-salwar-kammez-in-retail-shop-display.webp?b=1&s=170667a&w=0&k=20&c=zUziUuIhUH5J997tZmBtaShQoRTfKy-EwexD-vFp-E4=",
    title: "Kurtas ",
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
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNuYWtzfGVufDB8fDB8fHww",
    title: "Snaks",
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
      "https://media.istockphoto.com/id/1454649439/photo/kadhi-samosa-chaat.webp?b=1&s=170667a&w=0&k=20&c=7TWSZJPfi5Cz8YuGG554RHbrWKsuz9Ihf-FCvt7_TcQ=",
    title: "Samoosa",
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
      "https://media.istockphoto.com/id/1399151148/photo/brunette-indian-woman-choosing-a-new-tradition-saree-in-market-needlewoman-designer-drapery.webp?b=1&s=170667a&w=0&k=20&c=XkotzV_t53XzAf529LeUkNY8fx6SuKHxWi4tiMaL1Jw=",
    title: "Saree",
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
      "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJpZGFsJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    title: "Dress",
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
      "https://media.istockphoto.com/id/1403976698/photo/assorted-indian-various-food-with-spices-rice-and-fresh-vegetables.webp?b=1&s=170667a&w=0&k=20&c=wcdoXaNuPuyRNQe5w7BHLhvOGw_roILTmJDCFBg5ZOU=",
    title: "Platter",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },

  // Add more blog objects here
];

export default function BlogsSlider() {
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
              style={{ width: "20rem", margin: "10px" }}
              onClick={() => toggleZoom(blog.id)} // Toggle zoom on click
            >
              {blog.imageUrl && (
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                  style={{
                    objectFit: "cover",
                    maxWidth: "400px",
                    minWidth: "300px",
                    minHeight: "400px",
                    maxHeight: "400px",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}

              <div className="card-body">
                <div style={{ display: "inline-block" }}>
                  <h5 className="card-text" style={{color:"gray", fontSize:"16px"}}>
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
