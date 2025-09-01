// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWuFPD_qwvOqYvLxEVcyFAXEnLh-pzqqA",
  authDomain: "playgroundai-a1e1b.firebaseapp.com",
  projectId: "playgroundai-a1e1b",
  storageBucket: "playgroundai-a1e1b.firebasestorage.app",
  messagingSenderId: "695078257328",
  appId: "1:695078257328:web:6a51d698a289596dbdf175",
  measurementId: "G-JX17SN6XYC"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);
}

export { app, db, storage, auth, analytics };
