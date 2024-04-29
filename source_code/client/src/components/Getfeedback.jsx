import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './fback.css';
import axios from 'axios';

export default function Getfeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await axios.get('http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/Listfeedbacks');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    }

    fetchFeedbacks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container py-5 " style={{overflowX:"hidden"}}>
      <Slider {...settings}>
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="row d-flex justify-content-center">
            <div className="col-md-10 col-xl-8 text-center">
              <div className="card" style={{width:"100%"}}>
                <div className="card-body py-4 mt-2">
                  <h5 className="font-weight-bold" style={{color:"#ba81ad"}}>{feedback.username}</h5>
                  <h6 className="font-weight-bold my-3" style={{color:"gray"}}>{feedback.email}</h6>
                 
                  <p className="mb-2" style={{color:"gray"}}>
                    <i className="fas fa-quote-left pe-2 "></i>
                    "{feedback.des}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

