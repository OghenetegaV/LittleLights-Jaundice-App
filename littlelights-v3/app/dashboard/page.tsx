// File: app/dashboard/page.tsx
// This page component serves as the main dashboard for authenticated users.

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Import the new shared components
import Stars from '@/components/shared/Stars';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

// Define a type for the user data fetched from Firestore
interface UserData {
  fullName: string;
  userType: string;
  email: string;
  babyInfo?: {
    name: string;
    dateOfBirth: string;
    gestationPeriod: number;
  };
}

// Data for quick action cards
const quickActions = [
  { name: 'Start Screening', description: 'Take photo for jaundice screening', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.803-1.266A2 2 0 0110.607 4h2.786a2 2 0 011.664.89l.803 1.266A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ), href: '/add-screening' },
  { name: 'Connect Device', description: 'Control phototherapy device', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ), href: '/device' },
  { name: 'View History', description: 'Check previous results', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ), href: '/history' },
  { name: 'Connect Doctor', description: 'Consult a medical professional', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ), href: '/community' },
];

// Animate on load via CSS keyframes
const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect to handle authentication state changes and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        router.push('/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // useEffect to read theme preference from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
    }
  }, []);

  // useEffect to apply the theme class and update localStorage whenever isDarkMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode]);

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
        console.log("User data fetched:", userSnap.data());
      } else {
        console.log("No user data found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show a loading state while fetching user data
  if (!user || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-teal-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  // Determine baby's age in days
  const babyAgeInDays = userData.babyInfo?.dateOfBirth ?
    Math.floor((new Date().getTime() - new Date(userData.babyInfo.dateOfBirth).getTime()) / (1000 * 3600 * 24)) : null;

  return (
    <>
      <style>
        {fadeIn}
        {/* Import Inter font from Google Fonts */}
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
        {`body { font-family: 'Inter', sans-serif; }`}
      </style>
      <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 pb-20 overflow-auto relative`}>
        {/* Falling Stars Container */}
        <Stars />

        {/* Center content and limit its width for desktop view */}
        <div className="max-w-md mx-auto relative z-10">
          {/* Header Section */}
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

          {/* Welcome Card */}
          <div className="bg-teal-600 dark:bg-teal-800 text-white rounded-3xl shadow-lg dark:shadow-teal-900/50 p-6 mb-6 animate-[fadeIn_0.7s_ease-in-out_0.2s_forwards] opacity-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Welcome back, {userData.fullName.split(' ')[0]}</h2>
                <p className="text-sm mt-1">Monitor your baby's health with confidence</p>
              </div>
              {/* Replace with a user profile image from the user's data */}
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <img src="https://placehold.co/64x64/E2E8F0/A0AEC0?text=👶" alt="User profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Current Monitoring Section */}
          <div className="mb-6 animate-[fadeIn_0.7s_ease-in-out_0.4s_forwards] opacity-0">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Current Monitoring</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Replace with a baby profile image from user data */}
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👶</span>
                </div>
                <div>
                  <p className="font-semibold"> Baby {userData.babyInfo?.name || 'Baby'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {babyAgeInDays !== null ? `${babyAgeInDays} days old` : 'Age not available'}
                  </p>
                  <p className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-2">Latest Bilirubin: <span className="text-2xl">12.5</span> mg/dL</p>
                </div>
              </div>
              <div className="text-right">
                {/* Dynamically show risk level based on fetched data */}
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 text-xs font-semibold rounded-full mb-2">
                  Moderate Risk
                </span>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md px-4 py-2 text-sm">
                  New Reading
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-6 animate-[fadeIn_0.7s_ease-in-out_0.6s_forwards] opacity-0">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-start space-y-2">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-full">{action.icon}</div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{action.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-6 animate-[fadeIn_0.7s_ease-in-out_0.8s_forwards] opacity-0">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Activity</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 p-4 space-y-4">
              {/* Example Activity Items - will be dynamic */}
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Screening completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">12.5 mg/dL</p>
                  <span className="bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">normal</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Phototherapy session</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">45 min</p>
                  <span className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">complete</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Temperature recorded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold">36.8°C</p>
                  <span className="bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-red-50 dark:bg-red-950 rounded-xl shadow-lg dark:shadow-red-900/50 p-4 flex justify-between items-center animate-[fadeIn_0.7s_ease-in-out_1s_forwards] opacity-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.855A1 1 0 017.58 6H15a1 1 0 01.995 1.055L13.116 19.349A1.002 1.002 0 0112.115 20H4.885c-.576 0-1.115-.555-1.115-1.051l-1.1-12A1 1 0 012 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-200">Emergency Contact</p>
                <p className="text-xs text-red-600 dark:text-red-300">Call immediately if bilirubin &gt; 15 mg/dL</p>
              </div>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md">
              Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <Footer />
    </>
  );
}
