import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: Replace with your actual Firebase Web App configuration values
const firebaseConfig = {
  apiKey: "AIzaSyBy3ZA8cyFjbeFornH-tsKKZc_0ENTcfNs",
  authDomain: "qr-print-portal.firebaseapp.com",
  projectId: "qr-print-portal",
  storageBucket: "qr-print-portal.firebasestorage.app",
  messagingSenderId: "228128327965",
  appId: "1:228128327965:web:7f0e202ec97da9b53839f4",
  measurementId: "G-VJFSGDTSH7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
export const auth = getAuth(app);
