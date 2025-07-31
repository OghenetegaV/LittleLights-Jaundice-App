// app/scan/page.tsx
// This file defines the "Scan Instructions" page, which guides the user on how to take a proper photo.

// This component is a React Client Component because it will use client-side hooks for navigation.
"use client";

import { useRouter } from 'next/navigation'; // Hook for programmatic navigation
import React from 'react'; // Importing React for JSX

export default function ScanInstructionsPage() {
  const router = useRouter(); // Initializing the router hook

  // Function to handle navigation to the camera capture page
  const handleStartScan = () => {
    // Navigates to the '/scan/capture' route
    router.push('/scan/capture');
  };

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
        {/* Subtle icon for visual interest, with a slower pulse animation. */}
        <svg
          className="w-20 h-20 text-teal-500 mb-6 animate-pulse-slow"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z" />
        </svg>

        {/* Main heading for the instructions page. */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 mb-4 animate-fade-in-down drop-shadow-sm">
          How to Scan Your Little One
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6 animate-fade-in-up">
          For the most accurate results, please follow these simple steps:
        </p>

        {/* List of instructions with improved styling. */}
        <ul className="text-left text-gray-800 space-y-4 mb-8 w-full px-4 animate-fade-in">
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">1.</span>
            <span>Ensure good, natural lighting. Avoid direct sunlight or very dim rooms.</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">2.</span>
            <span>Place your baby on a flat, light-colored surface (e.g., a white sheet).</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">3.</span>
            <span>Hold your phone steady, about 6-8 inches from your baby&apos;s face.</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">4.</span>
            <span>Focus on the white part of the eye (sclera) or the baby&apos;s forehead.</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">5.</span>
            <span>Tap the screen to capture the image when ready.</span>
          </li>
        </ul>

        {/* Button to proceed to the camera capture, with gradient and enhanced effects. */}
        <button
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75"
          onClick={handleStartScan}
        >
          Understood, Start Scan
        </button>
      </div>
    </main>
  );
}
