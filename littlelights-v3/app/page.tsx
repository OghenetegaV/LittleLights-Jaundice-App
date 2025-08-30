// File: app/page.tsx
// This component defines the application's home page and manages the initial splash screen display.

"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/specific/SplashScreen';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const SPLASH_DURATION = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // The handleNavigation function is no longer needed since we are using <Link>
  // const handleNavigation = (path: string) => {
  //   router.push(path);
  // };

  if (showSplash) {
    return <SplashScreen posterSrc="/images/splash-screen-poster.png" />;
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-teal-50 text-gray-800 p-6">
      {/* App Logo/Icon */}
      <div className="w-24 h-24 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 mt-16 shadow-lg">
        {/* Replace with your actual logo component or image */}
        <span className="text-white text-5xl font-bold">L</span>
      </div>

      <h1 className="text-3xl font-semibold mt-4 text-teal-700">Little Lights</h1>
      <p className="text-lg text-gray-600 text-center max-w-sm mt-2">
        Neonatal Jaundice Screening
      </p>
      <p className="text-sm text-gray-500 text-center max-w-xs mt-2">
        AI-powered camera screening with integrated phototherapy device monitoring and care community
      </p>

      {/* Main Buttons */}
      <div className="w-full max-w-sm mt-10 space-y-4">
        {/* Use Link component for navigation */}
        <Link href="/sign-in" passHref>
          <Button 
            className="w-full bg-teal-600 text-white font-semibold rounded-lg shadow-md mb-4"
          >
            Get Started
          </Button>
        </Link>
        <Link href="/scan" passHref>
          <Button 
            variant="outline" 
            className="w-full border-2 border-teal-600 text-teal-600 font-semibold rounded-lg shadow-md"
          >
            Continue as Guest
          </Button>
        </Link>
      </div>

      {/* Feature Icons Section */}
      <div className="flex justify-around w-full max-w-sm mt-12 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-teal-600 mb-2">
            {/* Camera Screening Icon - Placeholder for a simple SVG or component */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5zm-2.5 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
          </div>
          <span className="text-xs text-gray-600">Camera Screening</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-teal-600 mb-2">
            {/* Device Control Icon - Placeholder */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radio-tower"><path d="M4 12v6m16-6v6M8 8v10m8-10v10M12 2v16m12-2a6 6 0 0 1-6-6M0 14a6 6 0 0 1 6-6M20 22H4"/></svg>
          </div>
          <span className="text-xs text-gray-600">Device Control</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-teal-600 mb-2">
            {/* Community Icon - Placeholder */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span className="text-xs text-gray-600">Community</span>
        </div>
      </div>
    </main>
  );
}
