// app/scan/results/page.tsx
// This page displays the results of the jaundice analysis, including the risk level and explanation.

// This is a React Client Component to use client-side hooks like useRouter.
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

// This is the component that contains the logic which uses the `useSearchParams` hook.
// It will be rendered inside a Suspense boundary.
function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve the risk level and explanation from the URL query parameters.
  const riskLevel = searchParams.get('riskLevel');
  const explanation = searchParams.get('explanation');

  // Define colors and icons based on the risk level for dynamic styling.
  let borderColor = 'border-white/50';
  let riskColor = 'text-gray-700';
  let icon = (
    <svg className="w-24 h-24 text-gray-400 mb-6 animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  );

  switch (riskLevel) {
    case 'Low Risk':
      borderColor = 'border-green-400';
      riskColor = 'text-green-700';
      icon = (
        <svg className="w-24 h-24 text-green-500 mb-6 animate-fade-in-down" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
      break;
    case 'Monitor Closely':
      borderColor = 'border-yellow-400';
      riskColor = 'text-yellow-700';
      icon = (
        <svg className="w-24 h-24 text-yellow-500 mb-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
      break;
    case 'Urgent Consultation Recommended':
      borderColor = 'border-red-400';
      riskColor = 'text-red-700';
      icon = (
        <svg className="w-24 h-24 text-red-500 mb-6 animate-bounce" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      );
      break;
    default:
      // Case for 'Error' or missing data
      borderColor = 'border-gray-400';
      riskColor = 'text-gray-700';
      break;
  }

  // Handle case where riskLevel is not available (e.g., direct access to URL without a photo).
  if (!riskLevel || !explanation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
        {/* Background blobs for visual effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1 absolute top-1/4 left-1/4"></div>
          <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-2 absolute bottom-1/4 right-1/4"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full animate-fade-in border border-red-400">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 mb-4 drop-shadow-sm animate-fade-in-down">
            Error
          </h1>
          <p className="text-lg text-gray-700 mb-8 animate-fade-in-up">
            Analysis data could not be found. Please try scanning again.
          </p>
          <button
            onClick={() => router.push('/scan')}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-75"
          >
            Start New Scan
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
      {/* Background blobs for visual effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1 absolute top-1/4 left-1/4"></div>
        <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-2 absolute bottom-1/4 right-1/4"></div>
      </div>

      <div className={`relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full animate-fade-in border-4 transition-colors duration-500 ${borderColor}`}>
        {icon}
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 mb-4 drop-shadow-sm animate-fade-in-down">
          Analysis Complete
        </h1>
        <p className="text-lg text-gray-700 mb-2 animate-fade-in-up">
          Based on the photo, the assessment is:
        </p>
        <p className={`text-3xl md:text-4xl font-extrabold ${riskColor} mb-6 animate-fade-in-down drop-shadow-sm`}>
          {riskLevel}
        </p>
        <p className="text-base text-gray-800 mb-8 px-4 animate-fade-in-up">
          {explanation}
        </p>

        {/* Disclaimer */}
        <div className="text-sm text-gray-500 mb-8 border-t pt-4 w-full">
          <p className="font-bold">Important Disclaimer:</p>
          <p>This app is a screening tool for informational purposes only and does not replace professional medical diagnosis or advice. Always consult a healthcare professional for actual medical concerns.</p>
        </div>

        {/* Button to start a new scan */}
        <button
          onClick={() => router.push('/scan')}
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75"
        >
          Start New Scan
        </button>
      </div>
    </main>
  );
}

// The main page component uses a Suspense boundary to wrap the client-side content.
export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
