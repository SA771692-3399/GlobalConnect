import React, { useState, useEffect } from 'react';

const HeadText = ({ t1, t2, t3 }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fadeClass = scrolled ? 'animate-fade-in' : '';

  return (
    <div className="mt-5">
      <style>
        {`
          .signature {
            font-family: cursive;
            font-size: 24px;
            color: #ba81ad;
            border-bottom: 2px solid #ba81ad;
            display: inline-block;
            padding: 4px 8px;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className={`container text-center mx-auto px-5 py-2 ${fadeClass}`}>
        <span className="signature">{t1}</span>
      </div>
      <div className={`container mx-auto px-5 py-2 lg:px-32 text-center lg:text-3xl text-gray-500 ${fadeClass}`}>
        {t2}
      </div>
      <div className={`container mx-auto px-5 py-2 lg:px-32 text-center ${fadeClass}`} style={{ color: 'gray' }}>
        {t3}
      </div>
    </div>
  );
};

export default HeadText;
