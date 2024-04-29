import React, { useState, useEffect } from 'react';
import './Slider.css';

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0); // State to track the active index of the image
  const images = [
    {
      id: 1,
      src: './p3.webp',
      alt: 'First slide',
    },
    {
      id: 2,
      src: './p6.jpg',
      alt: 'Second slide',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hpcnRzfGVufDB8fDB8fHww',
      alt: 'Third slide',
    },
    {
      id: 4,
      src: 'https://media.istockphoto.com/id/1494709456/photo/rogan-josh-on-steel-plate-close-up.webp?b=1&s=170667a&w=0&k=20&c=yBzjF9vQlv_oMXj47Z-jsCMv2CBKwzmepqWUAzovCwY=',
      alt: 'First slide',
    },
    {
      id: 5,
      src: './p1.jpg',
      alt: 'Second slide',
    },
    {
      id: 6,
      src: 'https://media.istockphoto.com/id/1454649439/photo/kadhi-samosa-chaat.webp?b=1&s=170667a&w=0&k=20&c=7TWSZJPfi5Cz8YuGG554RHbrWKsuz9Ihf-FCvt7_TcQ=',
      alt: 'Third slide',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the activeIndex to switch between images in a loop
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change the interval duration as needed (e.g., 2000ms = 2 seconds)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [images.length]); // Re-run effect when images length changes

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <img
          key={image.id}
          className={`slider-image ${index === activeIndex ? 'active' : ''}`}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </div>
  );
};

export default Slider;
