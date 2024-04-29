import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiStar } from 'react-icons/ci';

export default function Raiting({productID}) {
  const [ratingData, setRatingData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('No token found');
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/ratings/${productID}`);
        setRatingData(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    fetchData();
  }, [token]);

  // Function to render stars based on the rating value
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<CiStar key={i}  />);
    }
    return stars;
  };

  return (
    <div>
      {ratingData !== null ? (
        <p>
         
          {renderStars(ratingData)}
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
