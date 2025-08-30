// File: components/shared/Footer.tsx
// This component provides the bottom navigation bar.

'use client'

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl border-t border-gray-200 dark:border-gray-700 z-50 p-2 animate-[fadeIn_0.7s_ease-in-out_1.2s_forwards] opacity-0">
      <div className="max-w-md mx-auto flex justify-around items-center h-14">
        {/* Navigation Link: Home */}
        <Link href="/dashboard" className="flex flex-col items-center text-teal-600 dark:text-teal-400 text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7-2 2M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1H11m-6-10h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1z" />
          </svg>
          Home
        </Link>
        {/* Navigation Link: Scan */}
        <Link href="/scan" className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.803-1.266A2 2 0 0110.607 4h2.786a2 2 0 011.664.89l.803 1.266A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Scan
        </Link>
        {/* Navigation Link: Device */}
        <Link href="/device" className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Device
        </Link>
        {/* Navigation Link: Community */}
        <Link href="/community" className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Community
        </Link>
        {/* Navigation Link: History */}
        <Link href="/history" className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
