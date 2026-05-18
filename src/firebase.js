import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1l4p5pnqOS6N0J-37dXCi0b_EmIGKFdI",
  authDomain: "dsa-naturals.firebaseapp.com",
  projectId: "dsa-naturals",
  storageBucket: "dsa-naturals.firebasestorage.app",
  messagingSenderId: "521344849335",
  appId: "1:521344849335:web:3ed18361335dea71950432",
  measurementId: "G-9LWHWKBPWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
