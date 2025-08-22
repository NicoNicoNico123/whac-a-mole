// src/firebase.js
// Firebase configuration and initialization

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Debug environment variables
console.log('Environment variables available:');
console.log('VITE_FIREBASE_APIKEY:', import.meta.env.VITE_FIREBASE_APIKEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Firebase configuration - loads from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug the config
console.log('Firebase config:', firebaseConfig);

// Check if Firebase config is complete
const isFirebaseConfigComplete = firebaseConfig.apiKey && 
                                firebaseConfig.authDomain && 
                                firebaseConfig.projectId && 
                                firebaseConfig.storageBucket && 
                                firebaseConfig.messagingSenderId && 
                                firebaseConfig.appId;

let db;
if (isFirebaseConfigComplete) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} else {
  console.warn('Firebase configuration incomplete. Leaderboard features will be disabled.');
  // Create a mock db object for when Firebase is not available
  db = {
    collection: () => ({
      add: () => Promise.resolve(),
      orderBy: () => ({
        limit: () => ({
          onSnapshot: (callback, errorCallback) => {
            callback({ forEach: (fn) => {} });
            return () => {}; // unsubscribe function
          }
        })
      })
    })
  };
}

// Export the database instance
export { db, isFirebaseConfigComplete };