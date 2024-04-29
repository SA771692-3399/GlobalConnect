import React, { useState } from 'react';

const blogs = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/flagged/photo-1551854716-8b811be39e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2FyaXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Blog 1",
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
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNhcml8ZW58MHx8MHx8fDA%3D",
    title: "Blog 1",
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
      "https://images.unsplash.com/photo-1619516388835-2b60acc4049e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FyaXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Blog 1",
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
      "https://images.unsplash.com/photo-1610313517157-ee3d5f95d619?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhcml8ZW58MHx8MHx8fDA%3D",
    title: "Blog 1",
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
      "https://images.unsplash.com/photo-1600899620855-090b0be26e97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhcml8ZW58MHx8MHx8fDA%3D",
    title: "Blog 1",
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
      "https://images.unsplash.com/photo-1597897545901-6ac15b725974?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhcml8ZW58MHx8MHx8fDA%3D",
    title: "Blog 1",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },

  // Add more blog objects here
];

export default function Blogs2() {
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
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:"center" , margin:"0", padding:"0"}} >
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="card"
              style={{ width: '20rem', margin: '10px'}}
            >
              {blog.imageUrl && (
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                  style={{
                    objectFit: "cover",
                    maxWidth: "400px",
                    minWidth: "400px",
                    minHeight: "400px",
                    maxHeight: "400px",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}

             
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
}
