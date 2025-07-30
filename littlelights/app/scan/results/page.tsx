// app/scan/results/page.tsx
// This file defines the "Results" page, where the jaundice detection outcome is displayed.

// This is a Client Component as it will likely use client-side state or hooks for data.
"use client";

import { useRouter } from 'next/navigation'; // For navigation back to home or history
import React, { useState, useEffect } from 'react'; // React hooks for state and effects

export default function ResultsPage() {
  const router = useRouter(); // Initialize router for navigation

  // State to hold the mock result. In a real app, this would come from the AI analysis.
  // For the prototype, we'll simulate a random result to showcase different outcomes.
  const [result, setResult] = useState<{
    riskLevel: 'Low Risk' | 'Monitor Closely' | 'Urgent Consultation Recommended';
    explanation: string;
    color: string; // Tailwind color class
  }>({
    riskLevel: 'Low Risk',
    explanation: 'No significant yellowing detected. Continue to monitor your baby.',
    color: 'text-green-600',
  });

  // Simulate receiving a result after a short delay (like an API call)
  useEffect(() => {
    const simulateResult = () => {
      const outcomes = [
        {
          riskLevel: 'Low Risk',
          explanation: 'No significant yellowing detected. Continue to monitor your baby.',
          color: 'text-green-600',
        },
        {
          riskLevel: 'Monitor Closely',
          explanation: 'Mild yellowing detected. Please continue to monitor your baby closely and consult a healthcare professional if it worsens.',
          color: 'text-yellow-600',
        },
        {
          riskLevel: 'Urgent Consultation Recommended',
          explanation: 'Significant yellowing detected. Please seek urgent consultation with a healthcare professional immediately.',
          color: 'text-red-600',
        },
      ];
      // Pick a random outcome for demonstration purposes
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setResult(randomOutcome);
    };

    // Simulate loading time
    const timer = setTimeout(simulateResult, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup timer
  }, []); // Runs once on component mount

  // Function to navigate back to the home page
  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">
          Scan Results
        </h1>

        {/* Display the risk level and explanation */}
        <div className="mb-8 p-4 rounded-lg w-full">
          <p className={`text-4xl font-extrabold ${result.color} mb-2`}>
            {result.riskLevel}
          </p>
          <p className="text-lg text-gray-700">{result.explanation}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            onClick={handleGoHome}
          >
            Go to Home
          </button>
          {/* In a full app, you might have buttons like "View History" or "Find a Doctor" */}
          {result.riskLevel === 'Urgent Consultation Recommended' && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              onClick={() => alert('This would navigate to a "Find a Doctor" or emergency contact page.')}
            >
              Contact Doctor Now
            </button>
          )}
        </div>

        {/* Crucial Disclaimer */}
        <p className="text-sm text-gray-500 mt-8">
          Disclaimer: This app is a screening tool for informational purposes only and does not replace professional medical diagnosis or advice. Always consult a healthcare professional for actual medical concerns.
        </p>
      </div>
    </main>
  );
}
