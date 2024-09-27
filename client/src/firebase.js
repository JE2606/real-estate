// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-8a0e0.firebaseapp.com",
    projectId: "real-estate-8a0e0",
    storageBucket: "real-estate-8a0e0.appspot.com",
    messagingSenderId: "936418655086",
    appId: "1:936418655086:web:8ebf9458e81d614845df7f",
    measurementId: "G-3V65EZXHNS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);