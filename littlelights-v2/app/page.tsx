// app/page.tsx
// This file defines the application's home page and manages the initial splash screen display.

// This component is a React Client Component due to state management and client-side hooks.
"use client";

import { useRouter } from 'next/navigation'; // Imports the useRouter hook for navigation
import React, { useState, useEffect } from 'react'; // Imports useState and useEffect for state management
import SplashScreen from '../components/common/SplashScreen'; // Imports the SplashScreen component

export default function Home() {
  const router = useRouter(); // Initializes the router hook
  const [showSplash, setShowSplash] = useState(true); // Controls splash screen visibility
  const SPLASH_DURATION = 3000; // Duration for the splash screen in milliseconds

  // Manages the splash screen timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Hides splash screen after the set duration
    }, SPLASH_DURATION);

    // Clears the timer if the component unmounts prematurely.
    return () => clearTimeout(timer);
  }, []); // Effect runs once on initial render.

  // Handles navigation to the scan instructions page.
  const handleGetStarted = () => {
    router.push('/scan'); // Navigates to the '/scan' route.
  };

  // Conditionally renders the SplashScreen or the main home page content.
  if (showSplash) {
    // The posterSrc points to the image in the public directory.
    return <SplashScreen posterSrc="/images/splash-screen-poster.png" />;
  }

  // Main Home Page Content - Updated for better UX and jaundice focus
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Main content card with updated messaging and design */}
      {/* Added animate-fade-in for the transition from splash screen */}
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full animate-fade-in">
        {/* Subtle icon for visual interest */}
        <svg
          className="w-16 h-16 text-teal-400 mb-6 animate-pulse-slow"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z" />
        </svg>

        <h1 className="text-4xl font-bold text-teal-600 mb-4 animate-fade-in-down">
          A Simple Check for Your Baby's Health
        </h1>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in-up">
          Easily screen for signs of neonatal jaundice at home with LittleLights.
          Quick, intuitive, and designed for peace of mind.
        </p>

        {/* "Start Jaundice Check" Button */}
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
          onClick={handleGetStarted} // Triggers navigation to the scan instructions page.
        >
          Start Jaundice Check
        </button>

        {/* Optional: Add a subtle link to learn more about jaundice */}
        <button
          className="mt-4 text-teal-700 hover:text-teal-900 text-sm font-medium transition-colors duration-200"
          onClick={() => alert('This would navigate to an "About Jaundice" or "Educational Resources" page.')}
        >
          Learn More About Jaundice
        </button>
      </div>

      {/* A subtle illustration or icon is included below the main content. */}
      {/* This is a placeholder for the application's logo or a relevant icon. */}
      <div className="mt-12">
        {/* A subtle bounce animation is applied to this SVG icon. */}
        <svg
          className="w-24 h-24 text-yellow-400 animate-bounce-subtle"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
    </main>
  );
}
