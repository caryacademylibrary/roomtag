// Paste the config object from your Firebase project here.
//
// Firebase console → your project → gear icon (Project settings) →
// scroll to "Your apps" → the web app (</>) you registered → "SDK setup
// and configuration" → "Config".
//
// It's normal for these values to be visible in a public site's source
// code — Firebase apiKeys are not secrets. Access is actually controlled
// by the Firestore security rules described in README.md, not by hiding
// this file.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrARY-bp-0c7TXP0mRhqOvY03kL4n_i0I",
  authDomain: "roommate-selections.firebaseapp.com",
  projectId: "roommate-selections",
  storageBucket: "roommate-selections.firebasestorage.app",
  messagingSenderId: "318385361234",
  appId: "1:318385361234:web:799dd9ce4ad17a260eaa8b",
  measurementId: "G-Z67RH60JQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
