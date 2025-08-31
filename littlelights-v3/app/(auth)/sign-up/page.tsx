// File: app/(auth)/sign-up/page.tsx
// This page component renders the sign-up form for parents/caregivers and medical professionals with Firebase authentication.

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Import the initialized auth and db instances
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// A simple component for the tab buttons
const TabButton = ({ isActive, children, onClick }: { isActive: boolean, children: React.ReactNode, onClick: () => void }) => {
  const activeStyles = 'bg-white text-teal-700 shadow-md';
  const inactiveStyles = 'bg-gray-100 text-gray-500 hover:bg-gray-200';
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'w-1/2 p-2 rounded-xl font-semibold transition-colors duration-200',
        isActive ? activeStyles : inactiveStyles
      )}
    >
      {children}
    </button>
  );
};

// A simple component for the user type tabs
const UserTypeTab = ({ isActive, children, onClick }: { isActive: boolean, children: React.ReactNode, onClick: () => void }) => {
  const activeStyles = 'border-teal-700 text-teal-700 bg-teal-50 shadow-sm';
  const inactiveStyles = 'border-gray-200 text-gray-500 bg-transparent';
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'w-1/2 p-2 rounded-lg border-2 font-medium transition-colors duration-200',
        isActive ? activeStyles : inactiveStyles
      )}
    >
      {children}
    </button>
  );
};

// Tooltip for the info icon
const InfoTooltip = ({ message }: { message: string }) => (
  <span className="relative inline-block group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-1 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 w-max max-w-xs text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {message}
    </div>
  </span>
);

// Map Firebase authentication errors to user-friendly messages
const firebaseAuthErrors: { [key: string]: string } = {
  'auth/email-already-in-use': 'This email is already in use. Please sign in or use a different email.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'The password must be at least 6 characters long.',
  // You can add more error codes as needed
};

export default function SignUpPage() {
  const router = useRouter(); // Use the router hook
  const [userType, setUserType] = useState('parent');
  const [fullName, setFullName] = useState('');
  const [babysName, setBabysName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gestationPeriod, setGestationPeriod] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully:", userCredential.user);
      
      // Save user data to Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        fullName: fullName,
        email: email,
        userType: userType,
        ...(userType === 'parent' && { // Only add babyInfo for parents
          babyInfo: {
            name: babysName,
            dateOfBirth: dateOfBirth,
            gestationPeriod: parseInt(gestationPeriod),
          }
        })
      });

      console.log("User data saved to Firestore.");
      // Redirect to the dashboard on successful sign-in
      router.push('/dashboard');
      } catch (err: unknown) {
        // Use a type guard to check if the error is an object with a code and message
        if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
          console.error("Firebase Auth Error:", err.code, err.message);
          const customMessage = firebaseAuthErrors[err.code as keyof typeof firebaseAuthErrors];
          setError(customMessage || 'An unexpected error occurred. Please try again.');
        } else {
          // Handle generic or non-Firebase errors
          console.error("An unexpected error occurred:", err);
          setError('An unexpected error occurred. Please try again.');
        }
      }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-teal-50 text-gray-800 p-6">
      <div className="text-center mt-16 mb-8">
        <h1 className="text-3xl font-semibold text-teal-700">Little Lights</h1>
        <p className="text-sm text-gray-600">Neonatal Jaundice Screening & Care</p>
      </div>

      <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
        {/* Sign In / Sign Up Tabs */}
        <div className="flex space-x-2 p-1 rounded-xl bg-gray-100 mb-6">
          <Link href="/sign-in" passHref className="w-1/2 p-2 rounded-xl font-semibold text-center transition-colors duration-200 bg-gray-100 text-gray-500 hover:bg-gray-200">
            Sign In
          </Link>
          {/* Active tab for Sign Up */}
          <button className="w-1/2 p-2 rounded-xl font-semibold transition-colors duration-200 bg-white text-teal-700 shadow-md">
            Sign Up
          </button>
        </div>

        {/* User Type Tabs */}
        <div className="flex space-x-2 mb-2">
          <UserTypeTab 
            isActive={userType === 'parent'} 
            onClick={() => setUserType('parent')}
          >
            Parent/Caregiver
          </UserTypeTab>
          <UserTypeTab 
            isActive={userType === 'professional'} 
            onClick={() => setUserType('professional')}
          >
            Medical Professional
          </UserTypeTab>
        </div>
        
        {/* Dynamic fields for each user type */}
        <form key={userType} onSubmit={handleSignUp} className="space-y-4 transition-all duration-300 ease-in-out">
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="fullName">Full Name</label>
            <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          {userType === 'parent' && (
            <>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="babysName">Baby&apos;s Name</label>
                <Input id="babysName" type="text" placeholder="Enter baby's name" value={babysName} onChange={(e) => setBabysName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="dateOfBirth">Baby&apos;s Date of Birth</label>
                <input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150" />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 flex justify-between" htmlFor="gestationPeriod">
                  Gestation Period (weeks)
                  <InfoTooltip message="The number of weeks the baby was in the womb. Full-term is typically 37-42 weeks." />
                </label>
                <Input id="gestationPeriod" type="number" placeholder="e.g., 38" value={gestationPeriod} onChange={(e) => setGestationPeriod(e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="password">Password</label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="confirm-password">Confirm Password</label>
            <Input id="confirm-password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="pt-4">
            <Button type="submit" className="w-full bg-teal-600 text-white font-semibold rounded-lg shadow-md">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
