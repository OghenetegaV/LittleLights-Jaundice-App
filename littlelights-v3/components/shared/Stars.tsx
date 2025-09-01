import React, { useEffect, useState } from 'react';

// Define the type for a single star object
interface Star {
  key: number;
  left: number;
  delay: number;
  duration: number;
}

const Stars = () => {
  // Explicitly type the state to be an array of Star objects
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const numberOfStars = 100;
    const newStars: Star[] = [];

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
      {/* Styles for the animation, as Tailwind doesn't have a direct equivalent for @keyframes */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(200vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>

      <div className="absolute -top-20 inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.key}
            className="absolute bg-yellow-300 rounded-full animate-[fall_linear_infinite]"
            style={{
              left: `${star.left}vw`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              height: Math.random() < 0.5 ? '2px' : '3px',
              width: Math.random() < 0.5 ? '2px' : '3px',
              boxShadow: '0 0 5px #fff',
            }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default Stars;
