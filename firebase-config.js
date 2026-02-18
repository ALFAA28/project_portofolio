// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
// TODO: Replace with your actual config from Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyAgYQFWvMEdLcDSj1uanYmDxF6o1tky9Ns",
    authDomain: "project-portofolio-62c83.firebaseapp.com",
    projectId: "project-portofolio-62c83",
    storageBucket: "project-portofolio-62c83.firebasestorage.app",
    messagingSenderId: "372517328711",
    appId: "1:372517328711:web:d1a83655dbd43da630de62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
