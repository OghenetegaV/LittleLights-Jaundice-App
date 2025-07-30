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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">
          How to Scan Your Little One
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          For accurate results, please follow these simple steps:
        </p>

        <ul className="text-left text-gray-800 space-y-4 mb-8 w-full px-4">
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
            <span>Hold your phone steady, about 6-8 inches from your baby's face.</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">4.</span>
            <span>Focus on the white part of the eye (sclera) or the baby's forehead.</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 font-bold text-xl mr-3">5.</span>
            <span>Tap the screen to capture the image when ready.</span>
          </li>
        </ul>

        {/* Button to proceed to the camera capture */}
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={handleStartScan}
        >
          Understood, Start Scan
        </button>
      </div>
    </main>
  );
}
