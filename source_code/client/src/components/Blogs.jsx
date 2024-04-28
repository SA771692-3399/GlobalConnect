import React, { useState } from 'react';

const blogs = [
  {
    id: 1,
    image: "https://media.istockphoto.com/id/1911602322/photo/indian-woman-fashion-dress-salwar-kammez-in-retail-shop-display.webp?b=1&s=170667a&w=0&k=20&c=zUziUuIhUH5J997tZmBtaShQoRTfKy-EwexD-vFp-E4=",
    title: "Indian Traditional Kurtas",
    description: "Explore our exquisite collection of Indian traditional dresses, blending timeless elegance with cultural richness. Each piece showcases intricate craftsmanship and vibrant hues, perfect for celebrating occasions with grace and style. From graceful sarees to elegant lehengas and majestic sherwanis, our range caters to every taste and occasion. Embrace the allure of Indian heritage with our finely crafted attire, designed to make you stand out with poise and sophistication. Experience the essence of tradition and fashion come together in our Indian traditional dress collection.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    image:"https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNuYWtzfGVufDB8fDB8fHww",
    title: "Indian Snaks",
    description: "Our business specializes in offering a delightful range of traditional Indian snacks, curated to perfection. From crispy samosas to savory pakoras and delectable sweets like jalebi and gulab jamun, we bring authentic flavors that capture the essence of Indian culinary heritage. Each snack is prepared with care using time-honored recipes and high-quality ingredients, ensuring a taste experience that's both nostalgic and satisfying. Whether you crave spicy chaats or crave a bite of crunchy namkeens, our collection has something to delight every snack enthusiast. Explore our range and indulge in the rich diversity of Indian snack culture.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    image:"https://media.istockphoto.com/id/1454649439/photo/kadhi-samosa-chaat.webp?b=1&s=170667a&w=0&k=20&c=7TWSZJPfi5Cz8YuGG554RHbrWKsuz9Ihf-FCvt7_TcQ=",
    title: "Indian Fried Food",
    description: "As a local business, we take pride in offering a delectable array of traditional Indian food, crafted with authentic recipes passed down through generations. From aromatic biryanis to flavorful curries and tandoori delights, our menu embodies the rich culinary heritage of India. Each dish is prepared using fresh, locally sourced ingredients and traditional spices, ensuring an unforgettable dining experience. Whether you're craving the warmth of homemade dal or the tanginess of chutneys, our food reflects the diversity and richness of Indian cuisine. Visit us to savor the essence of India's traditional flavors right in your neighborhood.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    image:"https://media.istockphoto.com/id/1399151148/photo/brunette-indian-woman-choosing-a-new-tradition-saree-in-market-needlewoman-designer-drapery.webp?b=1&s=170667a&w=0&k=20&c=XkotzV_t53XzAf529LeUkNY8fx6SuKHxWi4tiMaL1Jw=",
    title: "Indian Traditional Saree",
    description: "Explore our exquisite collection of Indian traditional dresses, blending timeless elegance with cultural richness. Each piece showcases intricate craftsmanship and vibrant hues, perfect for celebrating occasions with grace and style. From graceful sarees to elegant lehengas and majestic sherwanis, our range caters to every taste and occasion. Embrace the allure of Indian heritage with our finely crafted attire, designed to make you stand out with poise and sophistication. Experience the essence of tradition and fashion come together in our Indian traditional dress collection.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 5,
    image:"https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJpZGFsJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    title: "Indian Traditional Dress",
    description: "Explore our exquisite collection of Indian traditional dresses, blending timeless elegance with cultural richness. Each piece showcases intricate craftsmanship and vibrant hues, perfect for celebrating occasions with grace and style. From graceful sarees to elegant lehengas and majestic sherwanis, our range caters to every taste and occasion. Embrace the allure of Indian heritage with our finely crafted attire, designed to make you stand out with poise and sophistication. Experience the essence of tradition and fashion come together in our Indian traditional dress collection.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 6,
    image:"https://media.istockphoto.com/id/1403976698/photo/assorted-indian-various-food-with-spices-rice-and-fresh-vegetables.webp?b=1&s=170667a&w=0&k=20&c=wcdoXaNuPuyRNQe5w7BHLhvOGw_roILTmJDCFBg5ZOU=",
    title: "Indian Traditional Food",
    description: "As a local business, we take pride in offering a delectable array of traditional Indian food, crafted with authentic recipes passed down through generations. From aromatic biryanis to flavorful curries and tandoori delights, our menu embodies the rich culinary heritage of India. Each dish is prepared using fresh, locally sourced ingredients and traditional spices, ensuring an unforgettable dining experience. Whether you're craving the warmth of homemade dal or the tanginess of chutneys, our food reflects the diversity and richness of Indian cuisine. Visit us to savor the essence of India's traditional flavors right in your neighborhood.",
    imageUrl: "https://via.placeholder.com/300",
  },
 
  // Add more blog objects here
];

export default function Blogs() {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionWordsLimit = 20;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = (blog) => {
    if (
      showFullDescription ||
      blog.description.split(' ').length <= descriptionWordsLimit
    ) {
      return blog.description;
    } else {
      const words = blog.description
        .split(' ')
        .slice(0, descriptionWordsLimit)
        .join(' ');
      return `${words} ...`;
    }
  };

  return (
    <div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:"center" }} className='container'>
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="card"
              style={{ width: '18rem', margin: '10px'}}
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
                    minHeight: '100px',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}

              <div className="card-body">
                <h5 className="card-text">{blog.title}</h5>
                <p style={{ fontSize: "12px" }}>
                  {renderDescription(blog)}{' '}
                  <span
                    className="read-more-text"
                    style={{
                      color: '#7e5888',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? 'Hide' : 'Read more'}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
}
