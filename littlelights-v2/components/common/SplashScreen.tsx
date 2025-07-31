// components/common/SplashScreen.tsx
// This component displays the splash screen with the app's poster.

"use client"; // This directive MUST be the very first line for a Client Component

import React from 'react';

// Define props for the SplashScreen component
interface SplashScreenProps {
  posterSrc: string; // URL or path to the poster image
}

export default function SplashScreen({ posterSrc }: SplashScreenProps) {
  return (
    // The outermost div takes up the full viewport width and height.
    // It's a flex container to center its children.
    // Added 'relative' to allow absolute positioning of children within it.
    <div className="flex flex-col items-center justify-center w-screen h-screen relative bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Container for the poster image. */}
      {/* This div is now set to cover the entire parent (w-screen h-screen) */}
      {/* and is absolutely positioned to act as a background layer. */}
      {/* Removed max-width, aspect ratio, rounded corners, and shadow to allow full coverage. */}
      {/* Removed overlay text as requested. */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Poster image. */}
        {/* The image is set to cover the entire container. */}
        <img
          src={posterSrc}
          alt="LittleLights App Poster"
          className="w-full h-full object-cover"
          // Fallback in case the image fails to load
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x600/CCCCCC/333333?text=Image+Load+Error';
            e.currentTarget.alt = 'Error loading poster image';
          }}
        />
      </div>
      {/* Loading indicator positioned absolutely to be visible over the full-screen background. */}
      {/* It's centered horizontally and placed near the bottom, with a higher z-index to ensure visibility. */}
      <p className="absolute bottom-8 text-lg text-teal-700 animate-pulse z-10">Loading...</p>
    </div>
  );
}
