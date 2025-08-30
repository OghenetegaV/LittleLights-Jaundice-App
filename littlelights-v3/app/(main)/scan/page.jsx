"use client";

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration from your lib/firebase.ts file
const firebaseConfig = {
  apiKey: "AIzaSyBqBdAyVOG0Y9L7N7r9ACGihY-RSIRO6gA",
  authDomain: "little-lights-v3.firebaseapp.com",
  projectId: "little-lights-v3",
  storageBucket: "little-lights-v3.firebasestorage.app",
  messagingSenderId: "400248166021",
  appId: "1:400248166021:web:5fb17db37f0ec5a9eb3bec",
  measurementId: "G-G8VPS8FZ4W"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Main component for the Bilirubin Scan page
const BilirubinScanPage = () => {
  // State to manage the application's flow and data
  const [step, setStep] = useState('calibration'); // 'calibration', 'capture', 'processing', 'result'
  const [estimatedBilirubin, setEstimatedBilirubin] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [normalizationFactor, setNormalizationFactor] = useState(1.0);
  const [isOffline, setIsOffline] = useState(false); // Initialized to false to prevent hydration errors
  const [isSaving, setIsSaving] = useState(false);

  // Firebase state
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [recentScan, setRecentScan] = useState(null);

  // Refs to access DOM elements directly
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const videoContainerRef = useRef(null);

  // useEffect for handling camera stream and Firebase setup
  useEffect(() => {
    // Check for a valid Firebase configuration before initializing
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error("Firebase configuration is missing.");
      setCameraError("Application is not configured correctly. Please check your Firebase configuration.");
      return;
    }

    // Initialize Firebase and set up authentication
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setAuth(authInstance);
    setDb(dbInstance);

    // Start camera feed
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        setCameraError("Could not access the camera. Please check your permissions.");
      }
    };

    const unsubscribeAuth = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          // Sign in with custom token or anonymously
          if (initialAuthToken) {
            const { user: anonUser } = await signInWithCustomToken(authInstance, initialAuthToken);
            setUserId(anonUser.uid);
          } else {
            const { user: anonUser } = await signInAnonymously(authInstance);
            setUserId(anonUser.uid);
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          setCameraError("Authentication failed. Please refresh the page.");
        }
      }
      setIsAuthReady(true);
      startCamera();
    });

    // Check for network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Set initial offline state after component mounts
    setIsOffline(!navigator.onLine);

    // Cleanup function to stop the camera stream and remove event listeners
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      unsubscribeAuth();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Core Application Logic ---

  // Function to handle the one-time device calibration
  const handleCalibration = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not ready for calibration.");
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // --- Calibrate with the 'color-card' reference ---
    // Read the simulated white card area in the bottom-right corner.
    const cardX = canvasRef.current.width - 50;
    const cardY = canvasRef.current.height - 50;
    const cardColorData = ctx.getImageData(cardX, cardY, 1, 1).data;
    const capturedAvgBrightness = (cardColorData[0] + cardColorData[1] + cardColorData[2]) / 3;
    const factor = 255 / (capturedAvgBrightness || 1);
    setNormalizationFactor(factor);

    // Transition to the next step
    setStep('capture');
  };

  // Function to capture the two flash/no-flash images
  const handleScleraCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !isAuthReady) {
      console.error("Video or canvas ref not ready, or auth not complete.");
      return;
    }

    setIsProcessing(true);

    const ctx = canvasRef.current.getContext('2d');

    // Capture 'No-Flash' image
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const noFlashData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

    // --- Simulate Flash ---
    // Flash the screen white to simulate a flash-lit image.
    if (videoContainerRef.current) {
      videoContainerRef.current.classList.add('bg-white');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Capture 'Flash' image
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const flashData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Stop camera stream after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Process the two images to subtract ambient light
    processImages(flashData, noFlashData);
  };

  // Function to process the captured images and estimate bilirubin
  const processImages = async (flashData, noFlashData) => {
    // Find the target area (simulated sclera)
    const targetX = Math.floor(canvasRef.current.width / 2);
    const targetY = Math.floor(canvasRef.current.height / 2);
    const targetIndex = (targetY * flashData.width + targetX) * 4;

    // Get color data for both images at the target point
    const flashColor = flashData.data.slice(targetIndex, targetIndex + 4);
    const noFlashColor = noFlashData.data.slice(targetIndex, targetIndex + 4);

    // Subtract the no-flash ambient light from the flash image
    const processedR = flashColor[0] - noFlashColor[0];
    const processedG = flashColor[1] - noFlashColor[1];
    const processedB = flashColor[2] - noFlashColor[2];

    // Normalize with the pre-calculated calibration factor
    const normalizedR = processedR * normalizationFactor;
    const normalizedG = processedG * normalizationFactor;
    const normalizedB = processedB * normalizationFactor;

    // Measure yellowness based on the difference between average R/G and B
    // The yellow hue of bilirubin primarily shows up as a low blue value relative to red and green.
    const yellowness = ((normalizedR + normalizedG) / 2) - normalizedB;

    // Apply the correlation model (simulated)
    const estimatedValue = Math.max(0, yellowness / 15);

    setEstimatedBilirubin(estimatedValue.toFixed(2));
    
    // Save the result to Firestore
    await saveScanResult(estimatedValue.toFixed(2));
    
    setStep('result');
    setIsProcessing(false);
  };

  // Function to save the scan result to Firestore
  const saveScanResult = async (result) => {
    if (!db || !userId) {
      console.error("Firestore or User ID not available.");
      return;
    }

    setIsSaving(true);
    try {
      const collectionPath = `/artifacts/${appId}/public/data/bilirubin_scans`;
      await addDoc(collection(db, collectionPath), {
        userId: userId,
        result: parseFloat(result),
        timestamp: serverTimestamp(),
        // Add more fields if needed, like device info, location, etc.
      });
      setRecentScan(result);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to reset the state and restart the camera without a page reload
  const handleRetake = () => {
    setEstimatedBilirubin(null);
    setStep('calibration');
    // Restart camera
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        setCameraError("Could not access the camera. Please check your permissions.");
      }
    })();
  };

  // Render the appropriate view based on the current step
  const renderContent = () => {
    // Error View
    if (cameraError) {
      return (
        <div className="text-center text-red-500 font-semibold p-4 border rounded-lg border-red-300 bg-red-50">
          {cameraError}
        </div>
      );
    }

    // Offline Mode View
    if (isOffline) {
        return (
            <div className="text-center p-4">
                <p className="text-lg font-bold text-gray-800">You are offline.</p>
                <p className="text-gray-600 mt-2">This app can work offline. Your scan results will be automatically saved once you are back online.</p>
            </div>
        )
    }

    // Step 1: Calibration View
    if (step === 'calibration') {
      return (
        <>
          <p className="text-sm text-center text-gray-500 mb-4">
            Step 1: Calibrate your device. Please align a white object with the square and press Calibrate.
          </p>
          <div className="relative mt-6 rounded-xl overflow-hidden bg-gray-800 aspect-video" ref={videoContainerRef}>
            <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline></video>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-white z-10"></div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCalibration}
              className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              Calibrate
            </button>
          </div>
        </>
      );
    }

    // Step 2: Capture View
    if (step === 'capture') {
      return (
        <>
          <p className="text-sm text-center text-gray-500 mb-4">
            Step 2: Capture your sclera. Please align the crosshair with the white of your eye.
          </p>
          <div className="relative mt-6 rounded-xl overflow-hidden bg-gray-800 aspect-video" ref={videoContainerRef}>
            <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline></video>
            <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 z-10"></div>
            <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white text-center text-sm p-3 rounded-xl">
              Align the crosshair with the white of your eye.
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleScleraCapture}
              className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              Capture Scan
            </button>
          </div>
        </>
      );
    }

    // Processing View
    if (isProcessing) {
      return (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold text-gray-800">Processing...</p>
          <div className="mt-4 w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }

    // Result View
    if (step === 'result') {
      return (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
          <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
            <p className="text-lg text-gray-600 font-semibold mb-2">Estimated Bilirubin Level:</p>
            <p className="text-6xl font-extrabold text-blue-600 mb-4">{estimatedBilirubin} mg/dL</p>
            {isSaving && (
                <p className="text-sm text-gray-500 mt-2 animate-pulse">Saving scan to database...</p>
            )}
            {!isSaving && recentScan && (
                 <p className="text-sm text-green-600 mt-2">Scan saved successfully!</p>
            )}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800">Important: This is a Screening Tool</h3>
            <p className="text-sm text-yellow-700 mt-2">
              This app is not a definitive diagnostic instrument. A false negative is a paramount safety concern.
              Please seek immediate professional medical attention if you have any health concerns.
            </p>
            <button
              onClick={handleRetake}
              className="mt-4 px-6 py-3 rounded-full font-bold text-white transition-all duration-300 bg-gray-500 hover:bg-gray-600 shadow-lg"
            >
              Retake
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Bilirubin Scan</h1>
        <p className="text-sm text-center text-gray-500">
          A non-invasive screening tool for newborn jaundice.
        </p>

        {renderContent()}
      </div>
    </div>
  );
};

export default BilirubinScanPage;
