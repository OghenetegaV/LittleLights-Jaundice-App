// app/page.tsx
// This file defines the application's home page (the root route '/').

// IMPORTANT: This directive marks this file as a Client Component.
// Client Components can use React Hooks (like useRouter) and event handlers (like onClick).
"use client";

import { useRouter } from 'next/navigation'; // Importing the useRouter hook for navigation

export default function Home() {
  const router = useRouter(); // Initializing the router hook

  // Function to handle navigation to the scan instructions page
  const handleGetStarted = () => {
    router.push('/scan'); // Navigates to the '/scan' route
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Hero Section for the application title. */}
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full transform transition-all duration-500 ease-in-out hover:scale-[1.02]">
        <h1 className="text-5xl font-bold text-teal-600 mb-4 animate-fade-in-down">
          LittleLights
        </h1>
        <p className="text-xl text-gray-700 mb-8 animate-fade-in-up">
          Early Detection, Brighter Future.
        </p>

        {/* "Get Started" Button with hover transitions. */}
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={handleGetStarted} // Using the new navigation handler
        >
          Get Started
        </button>
      </div>

      {/* A subtle illustration or icon is included here. */}
      {/* Placeholder for the application's logo/icon. */}
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
