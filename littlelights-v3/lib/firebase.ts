// File: lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqBdAyVOG0Y9L7N7r9ACGihY-RSIRO6gA",
  authDomain: "little-lights-v3.firebaseapp.com",
  projectId: "little-lights-v3",
  storageBucket: "little-lights-v3.firebasestorage.app",
  messagingSenderId: "400248166021",
  appId: "1:400248166021:web:5fb17db37f0ec5a9eb3bec",
  measurementId: "G-G8VPS8FZ4W"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);