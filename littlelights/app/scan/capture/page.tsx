// app/scan/capture/page.tsx
// This file defines the camera capture page where the user will take a photo of the baby.

// This is a Client Component because it will interact with the browser's camera API
// and use client-side state for the camera feed.
"use client";

import { useRouter } from 'next/navigation'; // For navigation after capture
import React, { useRef, useEffect, useState } from 'react'; // React hooks for camera stream and state

export default function CameraCapturePage() {
  const router = useRouter(); // Initialize router for navigation
  const videoRef = useRef<HTMLVideoElement>(null); // Ref to the video element for camera stream
  const photoRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element for capturing photo
  const [hasPhoto, setHasPhoto] = useState(false); // State to manage if a photo has been taken

  // Function to start the camera stream
  const getVideo = () => {
    // Request access to the user's media devices (camera)
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240 } }) // Requesting video stream with specific dimensions
      .then((stream) => {
        // If videoRef exists, assign the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play(); // Start playing the video stream
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        // In a real app, show a user-friendly message instead of an alert
        alert("Could not access camera. Please check permissions.");
      });
  };

  // Function to take a photo from the video stream
  const takePhoto = () => {
    const width = 320;
    const height = 240;

    const video = videoRef.current;
    const photo = photoRef.current;

    if (video && photo) {
      photo.width = width;
      photo.height = height;
      const ctx = photo.getContext('2d'); // Get 2D rendering context for the canvas

      if (ctx) {
        // Draw the current frame from the video onto the canvas
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true); // Indicate that a photo has been taken
        // In a real app, you would now process this image (e.g., convert to Base64 and send to API)
        // For this prototype, we'll just show the captured image.
      }
    }
  };

  // Function to retry taking a photo
  const retakePhoto = () => {
    setHasPhoto(false); // Reset hasPhoto state
    getVideo(); // Restart the video stream
  };

  // Function to proceed to results (mock navigation for now)
  const proceedToResults = () => {
    // In a real app, you'd pass the image data or a reference to it
    router.push('/scan/results'); // Navigate to the results page
  };

  // Effect hook to start video stream when component mounts
  useEffect(() => {
    getVideo();
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">
          Capture Your Baby's Image
        </h1>

        {/* Video stream or captured photo display */}
        <div className="relative w-full max-w-xs aspect-video bg-gray-200 rounded-lg overflow-hidden mb-6 shadow-inner">
          {/* Video element for live camera feed */}
          <video ref={videoRef} className={`w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}></video>
          {/* Canvas element to display the captured photo */}
          <canvas ref={photoRef} className={`w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}></canvas>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4">
          {!hasPhoto ? (
            // Button to take a photo
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              onClick={takePhoto}
            >
              Capture Photo
            </button>
          ) : (
            <>
              {/* Button to retake photo */}
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={retakePhoto}
              >
                Retake
              </button>
              {/* Button to proceed to results */}
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={proceedToResults}
              >
                Proceed to Results
              </button>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-gray-500 mt-6">
          This app is a screening tool. Always consult a healthcare professional.
        </p>
      </div>
    </main>
  );
}
