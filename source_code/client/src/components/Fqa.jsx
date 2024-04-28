import axios from "axios";
import React, { useEffect, useState } from "react";
import Topnav from "./Topnav";
import MainNav from "./MainNav";
import Slider from "./Slider";
import Footer from "./Footer";

const Fqa = () => {
  const [faqData, setFaqData] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/fqalist");
        setFaqData(response.data.faqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error.message);
        // Handle error, e.g., show error message to the user
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
       <Topnav />
      <MainNav />
      <Slider />
    <div className="container mb-5 headText">
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <div className="accordion" id="faqAccordion">
        {faqData.map((faq, index) => (
          <div className="accordion-item" key={index + 1}>
            <h2 className="accordion-header" id={`heading${index + 1}`}>
              <button
                className={`accordion-button ${activeFaq === index ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeFaq === index ? "true" : "false"}
                aria-controls={`collapse${index + 1}`}
              >
                {faq.que}
              </button>
            </h2>
            <div
              id={`collapse${index + 1}`}
              className={`accordion-collapse collapse ${activeFaq === index ? "show" : ""}`}
              aria-labelledby={`heading${index + 1}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{faq.ans}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Fqa;
