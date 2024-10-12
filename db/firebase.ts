// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getStorage } from 'firebase/storage';

// const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
// const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
// const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
// const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'kalandorokjatek-8d9d0.appspot.com';
// const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
// const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET, // Ensure this has the correct bucket URL
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0thGtS--bKbost_piQ_7jTdEuR2Xh8oI",
  authDomain: "eliteperformance-6fc5c.firebaseapp.com",
  projectId: "eliteperformance-6fc5c",
  storageBucket: "eliteperformance-6fc5c.appspot.com",
  messagingSenderId: "731997351879",
  appId: "1:731997351879:web:5197dd4497c0f0554233e2",
  measurementId: "G-8BWWEW2VJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// Analytics initialization should be done conditionally
let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics }; 