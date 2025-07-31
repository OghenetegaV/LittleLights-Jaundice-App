// app/page.tsx
// This file defines the application's home page and manages the initial splash screen display.

// This component is a React Client Component due to state management and client-side hooks.
"use client";

import { useRouter } from 'next/navigation'; // Imports the useRouter hook for navigation
import React, { useState, useEffect } from 'react'; // Imports useState and useEffect for state management
import SplashScreen from '../components/common/SplashScreen'; // Imports the SplashScreen component
import NextImage from 'next/image'; // Imports the Next.js Image component and renames it to avoid conflicts

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

  // Main Home Page Content - Designed for a more fascinating UX
  return (
    // Main container with a background gradient and relative positioning for blob animations.
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
      {/* Abstract glowing background elements (blobs) for a dynamic visual effect. */}
      {/* These are positioned absolutely and use blur and mix-blend-mode for a soft, ethereal look. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1 absolute top-1/4 left-1/4"></div>
        <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-2 absolute bottom-1/4 right-1/4"></div>
      </div>

      {/* Main content card with updated messaging and design. */}
      {/* It's positioned relative with a higher z-index to sit above the background blobs. */}
      {/* Uses a semi-transparent white background with backdrop blur and a subtle border. */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full animate-fade-in border border-white/50">
        {/* Replaced the SVG icon with your app's logo using the Next.js Image component. */}
        <NextImage
          src="/images/logo/logo-colored.png" // The path to your logo in the public directory
          alt="LittleLights App Logo" // Accessible alt text for the image
          width={96} // Equivalent to w-24 (96px)
          height={96} // Equivalent to h-24 (96px)
          className="mb-6 animate-fade-in-up" // Styling for position and animation
        />

        {/* Main heading with increased size, extra bold font, and subtle drop shadow. */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 mb-4 animate-fade-in-down drop-shadow-sm">
          A Brighter Start for Every Baby
        </h1>
        {/* Sub-text with improved clarity and focus. */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-in-up">
          Quickly and easily check for signs of jaundice, right from your phone.
          Empowering parents with peace of mind.
        </p>

        {/* "Start Jaundice Check" Button with a gradient background and enhanced hover effects. */}
        <button
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75"
          onClick={handleGetStarted} // Triggers navigation to the scan instructions page.
        >
          Start Jaundice Check
        </button>

        {/* "Learn More About Jaundice" button with an arrow for visual cue. */}
        <button
          className="mt-6 text-teal-800 hover:text-teal-900 text-base font-semibold transition-colors duration-200"
          // Replaced 'alert' with 'console.log' as 'alert' can cause issues in this environment.
          // You can replace this with `router.push('/learn-more')` when you create that page.
          onClick={() => console.log('This would navigate to an "About Jaundice" or "Educational Resources" page.')}
        >
          Learn More About Jaundice →
        </button>
      </div>
    </main>
  );
}
