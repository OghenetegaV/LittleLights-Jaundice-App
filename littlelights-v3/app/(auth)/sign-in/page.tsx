// File: app/(auth)/sign-in/page.tsx
// This page component renders the sign-in form with Firebase authentication.

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import the initialized auth instance
import { useRouter } from 'next/navigation';

// Map Firebase authentication errors to user-friendly messages
const firebaseAuthErrors: { [key: string]: string } = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/wrong-password': 'Invalid password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
};

export default function SignInPage() {
  const router = useRouter(); // Use the router hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully:", userCredential.user);
      // Redirect to the dashboard on successful sign-in
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Firebase Auth Error:", err.code, err.message);
      
      const customMessage = firebaseAuthErrors[err.code];
      setError(customMessage || 'An unexpected error occurred. Please try again.');
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
          {/* Active tab for Sign In */}
          <button className="w-1/2 p-2 rounded-xl font-semibold transition-colors duration-200 bg-white text-teal-700 shadow-md">
            Sign In
          </button>
          {/* Link to the separate Sign Up page */}
          <Link href="/sign-up" passHref className="w-1/2 p-2 rounded-xl font-semibold text-center transition-colors duration-200 bg-gray-100 text-gray-500 hover:bg-gray-200">
            Sign Up
          </Link>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block" htmlFor="password">Password</label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          <div className="pt-4">
            <Button type="submit" className="w-full bg-teal-600 text-white font-semibold rounded-lg shadow-md">
              Sign In
            </Button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
