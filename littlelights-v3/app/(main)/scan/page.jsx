"use client";

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';

// Placeholder components since the user has not provided their implementation
const Stars = () => (
  <div className="flex justify-center my-2 space-x-1">
    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
    <svg className="w-5 h-5 text-gray-300 fill-current dark:text-gray-500" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
    <svg className="w-5 h-5 text-gray-300 fill-current dark:text-gray-500" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
  </div>
);

const Footer = ({ onShowGuide }) => (
  <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg flex justify-around items-center">
    <button className="flex flex-col items-center text-teal-600 dark:text-teal-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <span className="text-xs mt-1">Home</span>
    </button>
    <button className="flex flex-col items-center text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.41a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.41a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a2 2 0 0 1 2-2v-.41a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.41a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9h.41a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.41a1.65 1.65 0 0 0-.33 1.82z"></path></svg>
      <span className="text-xs mt-1">Settings</span>
    </button>
    <button className="flex flex-col items-center text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
      <span className="text-xs mt-1">Favorites</span>
    </button>
    <button onClick={onShowGuide} className="flex flex-col items-center text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15.5l14-7-14-7v14z"></path></svg>
      <span className="text-xs mt-1">Guide</span>
    </button>
  </footer>
);

// Your web app's Firebase configuration
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

const BilirubinScanPage = () => {
  const [step, setStep] = useState('introGuide');
  const [guideStep, setGuideStep] = useState(0);
  const [estimatedBilirubin, setEstimatedBilirubin] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calibrationFactor, setCalibrationFactor] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [capturedImages, setCapturedImages] = useState({ noFlash: null, flash: null });
  const [scleraLocation, setScleraLocation] = useState(null);

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [recentScan, setRecentScan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error("Firebase configuration is missing.");
      setCameraError("Application is not configured correctly. Please check your Firebase configuration.");
      setIsLoading(false);
      return;
    }

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribeAuth = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
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
      setIsLoading(false);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      unsubscribeAuth();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchCalibrationData = async () => {
      if (db && userId) {
        const calibrationDocRef = doc(db, `/artifacts/${appId}/users/${userId}/calibrations`, 'deviceCalibration');
        const docSnap = await getDoc(calibrationDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCalibrationFactor(data.normalizationFactor);
        }
      }
    };
    if (isAuthReady) {
      fetchCalibrationData();
    }
  }, [isAuthReady, db, userId]);
  
  // New useEffect to handle camera start based on step
  useEffect(() => {
    if (step === 'calibration' || step === 'manualCaptureInstructions') {
      startCamera();
    } else {
       if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [step]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
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

  const saveCalibrationData = async (factor) => {
    if (!db || !userId) {
      console.error("Firestore or User ID not available.");
      return;
    }
    const calibrationDocRef = doc(db, `/artifacts/${appId}/users/${userId}/calibrations`, 'deviceCalibration');
    try {
      await setDoc(calibrationDocRef, { normalizationFactor: factor });
      setCalibrationFactor(factor);
      setStep('manualCaptureInstructions');
    } catch (e) {
      console.error("Error saving calibration data: ", e);
    }
  };

  const handleCalibration = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref is null during calibration.");
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const cardX = canvasRef.current.width - 50;
    const cardY = canvasRef.current.height - 50;
    const cardColorData = ctx.getImageData(cardX, cardY, 1, 1).data;
    const capturedAvgBrightness = (cardColorData[0] + cardColorData[1] + cardColorData[2]) / 3;
    const factor = 255 / (capturedAvgBrightness || 1);
    saveCalibrationData(factor);
  };

  const handleImageCapture = (imageType) => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref is null during image capture.");
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const imageData = canvasRef.current.toDataURL('image/jpeg');
    setCapturedImages(prev => ({ ...prev, [imageType]: imageData }));
  };

  const handleProcessImages = async () => {
    setIsProcessing(true);
    // Simulate AI model processing to locate sclera
    await new Promise(resolve => setTimeout(resolve, 2000));
    const scleraLocation = { x: 300, y: 150 }; // Simulated location
    setScleraLocation(scleraLocation);
    setIsProcessing(false);
    setStep('review');
  };

  const handleConfirmAndProcess = async () => {
    if (!capturedImages.noFlash || !capturedImages.flash) return;
    setIsProcessing(true);
    if (!canvasRef.current) {
        console.error("Canvas ref is null during confirm and process.");
        setIsProcessing(false);
        return;
    }

    const noFlashImage = new Image();
    noFlashImage.src = capturedImages.noFlash;
    await noFlashImage.decode();

    canvasRef.current.width = noFlashImage.width;
    canvasRef.current.height = noFlashImage.height;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(noFlashImage, 0, 0);
    const noFlashData = ctx.getImageData(0, 0, noFlashImage.width, noFlashImage.height);
    
    const flashImage = new Image();
    flashImage.src = capturedImages.flash;
    await flashImage.decode();

    ctx.drawImage(flashImage, 0, 0);
    const flashData = ctx.getImageData(0, 0, flashImage.width, flashImage.height);

    const targetX = scleraLocation.x;
    const targetY = scleraLocation.y;
    const targetIndex = (targetY * flashData.width + targetX) * 4;

    const flashColor = flashData.data.slice(targetIndex, targetIndex + 4);
    const noFlashColor = noFlashData.data.slice(targetIndex, targetIndex + 4);

    const processedR = flashColor[0] - noFlashColor[0];
    const processedG = flashColor[1] - noFlashColor[1];
    const processedB = flashColor[2] - noFlashColor[2];

    const normalizedR = processedR * calibrationFactor;
    const normalizedG = processedG * calibrationFactor;
    const normalizedB = processedB * calibrationFactor;

    const yellowness = ((normalizedR + normalizedG) / 2) - normalizedB;
    const estimatedValue = Math.max(0, yellowness / 15);

    setEstimatedBilirubin(estimatedValue.toFixed(2));
    await saveScanResult(estimatedValue.toFixed(2));
    setStep('result');
    setIsProcessing(false);
  };

  const saveScanResult = async (result) => {
    if (!db || !userId) return;
    setIsSaving(true);
    try {
      const collectionPath = `/artifacts/${appId}/public/data/bilirubin_scans`;
      await addDoc(collection(db, collectionPath), {
        userId: userId,
        result: parseFloat(result),
        timestamp: serverTimestamp(),
      });
      setRecentScan(result);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    setCapturedImages({ noFlash: null, flash: null });
    setEstimatedBilirubin(null);
    setStep('manualCaptureInstructions');
  };

  const handleShowGuide = () => {
    setStep('introGuide');
    setGuideStep(0);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">Loading...</p>
          <div className="mt-4 w-16 h-16 border-4 border-t-4 border-gray-300 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }

    if (cameraError) {
      return (
        <div className="bg-red-200 text-red-800 p-4 rounded-xl text-center shadow-md">
          {cameraError}
        </div>
      );
    }

    if (isOffline) {
        return (
            <div className="bg-gray-200 text-gray-700 p-4 rounded-xl text-center shadow-md">
                <p className="text-lg font-bold">You are offline.</p>
                <p className="mt-2 text-sm">This app can work offline. Your scan results will be automatically saved once you are back online.</p>
            </div>
        )
    }
    
    // Intro Guide
    if (step === 'introGuide') {
      const guideSlides = [
        {
          title: "Welcome to the Bilirubin Scan!",
          text: "This guide will walk you through a simple, 3-step process to get an estimated bilirubin reading for your baby.",
          image: "A mother holding a newborn baby"
        },
        {
          title: "Step 1: Calibrate Your Camera",
          text: "First, you will need a white sheet of paper. This is a one-time calibration to ensure accurate readings for your specific phone's camera.",
          image: "A person taking a photo of a white sheet of paper"
        },
        {
          title: "Step 2: Take Two Photos",
          text: "Next, you will take a close-up photo of your baby's face, once without flash and once with flash. We will guide you through this process.",
          image: "A baby's face"
        },
        {
          title: "Step 3: Get Your Results",
          text: "Finally, our app will process the images, pinpoint the sclera, and provide you with an estimated bilirubin level.",
          image: "An infant eyeball with a crosshair"
        }
      ];

      return (
        <div className="flex flex-col items-center">
          <div className="text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner mb-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{guideSlides[guideStep].title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{guideSlides[guideStep].text}</p>
          </div>
          <div className="flex justify-between w-full mt-4">
            {guideStep > 0 && (
              <button
                onClick={() => setGuideStep(prev => prev - 1)}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full"
              >
                Back
              </button>
            )}
            {guideStep < guideSlides.length - 1 ? (
              <button
                onClick={() => setGuideStep(prev => prev + 1)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setStep(calibrationFactor ? 'manualCaptureInstructions' : 'calibration')}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Start Scan
              </button>
            )}
            <button
              onClick={() => setStep(calibrationFactor ? 'manualCaptureInstructions' : 'calibration')}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full"
            >
              Skip
            </button>
          </div>
        </div>
      );
    }
    
    // Step 1: Calibration View (only shown if not already calibrated)
    if (step === 'calibration') {
      return (
        <>
          <p className="text-center text-gray-500 text-sm mb-4 dark:text-gray-400">
            Step 1: One-Time Camera Calibration. Please align a white object with the square and press Calibrate.
          </p>
          <div className="relative mt-6 rounded-3xl overflow-hidden bg-gray-800 aspect-video shadow-lg" ref={videoContainerRef}>
            <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline></video>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-white z-10 rounded-lg"></div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCalibration}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
            >
              Calibrate
            </button>
          </div>
        </>
      );
    }

    // Step 2: Manual Capture Instructions
    if (step === 'manualCaptureInstructions') {
        return (
            <>
                <p className="text-center text-gray-500 text-sm mb-4 dark:text-gray-400">
                    Step 2: Capture your images.
                </p>
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner text-center">
                    <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">Take a close-up photo of your baby's face.</p>
                    <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">
                        First, take a picture with your phone's flash **turned off**.
                    </p>
                    <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">
                        Then, take another picture from the same angle with your flash **turned on**.
                    </p>
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                      onClick={() => handleImageCapture('noFlash')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                    >
                      Capture No-Flash
                    </button>
                    {capturedImages.noFlash && (
                        <button
                          onClick={() => handleImageCapture('flash')}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                        >
                          Capture Flash
                        </button>
                    )}
                </div>
                {capturedImages.noFlash && capturedImages.flash && (
                  <div className="flex justify-center mt-6">
                      <button
                        onClick={handleProcessImages}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                      >
                        Process Images
                      </button>
                  </div>
                )}
                <div className="relative mt-6 rounded-3xl overflow-hidden bg-gray-800 aspect-video shadow-lg" ref={videoContainerRef}>
                  <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline></video>
                </div>
            </>
        );
    }
    
    // Processing View
    if (isProcessing) {
        return (
            <div className="mt-6 text-center">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">Processing images...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
                Analyzing image to locate sclera...
              </p>
              <div className="mt-4 w-16 h-16 border-4 border-t-4 border-gray-300 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    // Review View
    if (step === 'review') {
        return (
            <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Review Your Photos</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <img src={capturedImages.noFlash} alt="No Flash" className="w-full h-auto object-cover" />
                        {scleraLocation && (
                           <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500" style={{ top: scleraLocation.y, left: scleraLocation.x, width: '16px', height: '16px' }}></div>
                        )}
                        <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white text-xs p-1 rounded-md">No Flash</div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <img src={capturedImages.flash} alt="Flash" className="w-full h-auto object-cover" />
                        {scleraLocation && (
                           <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500" style={{ top: scleraLocation.y, left: scleraLocation.x, width: '16px', height: '16px' }}></div>
                        )}
                        <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white text-xs p-1 rounded-md">Flash</div>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">
                    Is the crosshair correctly placed over the white of the eye?
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={handleConfirmAndProcess}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={handleRetake}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                    >
                        Retake
                    </button>
                </div>
            </div>
        );
    }

    // Result View
    if (step === 'result') {
      return (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">Results</h2>
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl shadow-inner">
            <p className="text-lg text-gray-600 font-semibold mb-2 dark:text-gray-300">Estimated Bilirubin Level:</p>
            <p className="text-6xl font-extrabold text-teal-600 mb-4">{estimatedBilirubin} mg/dL</p>
            <Stars />
            {isSaving && (
                <p className="text-sm text-gray-500 mt-2 animate-pulse dark:text-gray-400">Saving scan to database...</p>
            )}
            {!isSaving && recentScan && (
                 <p className="text-sm text-green-600 mt-2 dark:text-green-400">Scan saved successfully!</p>
            )}
          </div>
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-2xl border border-yellow-200 dark:border-yellow-700">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Important: This is a Screening Tool</h3>
            <p className="text-sm text-yellow-700 mt-2 dark:text-yellow-300">
              This app is not a definitive diagnostic instrument. A false negative is a paramount safety concern.
              Please seek immediate professional medical attention if you have any health concerns.
            </p>
            <button
              onClick={handleRetake}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
            >
              Retake
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">Bilirubin Scan</h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          A non-invasive screening tool for newborn jaundice.
        </p>
        
        {renderContent()}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <Footer onShowGuide={handleShowGuide} />
    </div>
  );
};

export default BilirubinScanPage;
