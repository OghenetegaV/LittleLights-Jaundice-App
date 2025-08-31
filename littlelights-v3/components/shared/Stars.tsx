import React, { useEffect, useState } from 'react';

const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const numberOfStars = 100;
    const newStars = [];

    // Generate an array of star objects with randomized properties
    for (let i = 0; i < numberOfStars; i++) {
      const randomLeft = Math.random() * 100;
      const randomDelay = Math.random() * 5;
      const randomDuration = 5 + Math.random() * 40;

      newStars.push({
        key: i,
        left: randomLeft,
        delay: randomDelay,
        duration: randomDuration,
      });
    }

    setStars(newStars);
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <>
      {/* Styles are included directly in the component for self-containment */}
      <style>
        {`
          /* Define the fall animation for the stars */
          @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(200vh) rotate(360deg); opacity: 0; }
          }
          
          .stars-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
            overflow: hidden;
          }

          /* Base styles for the stars */
          .stars-container .star {
            position: absolute;
            background: yellow;
            border-radius: 50%;
            height: 2px;
            width: 2px;
            opacity: 0;
            top: -20%;
            box-shadow: 0 0 5px #fff;
            animation: fall linear infinite;
          }

          /* Alternate style for some stars to create visual variety */
          .stars-container .star:nth-child(even) {
            height: 3px;
            width: 3px;
          }
        `}
      </style>

      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.key}
            className="star"
            style={{
              left: `${star.left}vw`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default Stars;
