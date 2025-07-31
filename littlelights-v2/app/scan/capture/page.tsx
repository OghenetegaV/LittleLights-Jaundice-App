// app/scan/capture/page.tsx
// This file defines the camera capture page, allowing users to take a photo for analysis.

// This is a React Client Component to access browser APIs like the camera.
"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Importing Next.js Image component for optimized images

interface JaundiceResult {
  riskLevel: 'Low Risk' | 'Monitor Closely' | 'Urgent Consultation Recommended' | 'Error';
  explanation: string;
}

export default function CameraCapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null); // Ref for the video element
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element
  const [photo, setPhoto] = useState<string | null>(null); // Stores the captured photo as a data URL
  const [isLoading, setIsLoading] = useState(false); // Manages the loading state for analysis
  const [error, setError] = useState<string | null>(null); // Handles camera or API errors
  const [showToast, setShowToast] = useState(false); // State for toast message visibility

  // Effect to handle camera access and video stream.
  useEffect(() => {
    // Asynchronously gets access to the user's camera.
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please check permissions.');
      }
    };

    // Starts the camera when the component mounts.
    startCamera();

    // Clean up the video stream when the component unmounts.
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stops all tracks to release the camera.
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once.

  // Captures a photo from the video feed.
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(imageDataUrl); // Sets the captured photo state.
      }
    }
  };

  // Retakes the photo by clearing the current photo state.
  const retakePhoto = () => {
    setPhoto(null);
  };

  // Handles the submission of the photo for AI analysis.
  const handleAnalyze = async () => {
    if (!photo) {
      setError('No photo has been captured.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowToast(true);

    try {
      // Sends the image data to the Next.js API route.
      const response = await fetch('/api/detect-jaundice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: photo.split(',')[1], // Extracts Base64 data
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result: JaundiceResult = await response.json();
      
      // Navigates to the results page with the result data as URL parameters.
      router.push(
        `/scan/results?riskLevel=${result.riskLevel}&explanation=${encodeURIComponent(
          result.explanation
        )}`
      );
    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      // This block will always execute, ensuring loading state is reset.
      setIsLoading(false);
      setShowToast(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
      {/* Background blobs for visual effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1 absolute top-1/4 left-1/4"></div>
        <div className="w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-2 absolute bottom-1/4 right-1/4"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full animate-fade-in border border-white/50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 mb-4 drop-shadow-sm animate-fade-in-down">
          Capture Photo
        </h1>
        <p className="text-lg text-gray-700 mb-6 animate-fade-in-up">
          Please position your camera to capture the baby&apos;s skin and tap the button below.
        </p>

        {/* Camera and Preview Container */}
        <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner mb-6">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-700 text-sm p-4">
              {error}
            </div>
          )}
          {/* Live video stream when no photo is captured */}
          {!photo && !error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
          )}
          {/* Captured photo preview */}
          {photo && (
            <Image src={photo} alt="Captured preview" layout="fill" objectFit="cover" />
          )}
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!photo ? (
            <button
              onClick={capturePhoto}
              disabled={isLoading}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300"
            >
              Capture
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                disabled={isLoading}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Retake
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze'
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 p-4 rounded-xl bg-teal-500 text-white shadow-xl transition-all duration-500 transform ease-in-out z-50">
          <p>Analyzing image. This may take a moment...</p>
        </div>
      )}
    </main>
  );
}
