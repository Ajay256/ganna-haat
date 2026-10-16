import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDDRsKLEMw-wLCuEft6t6g5HgQDczDMHSE",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "gannahaat-68618.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gannahaat-68618",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "gannahaat-68618.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "899914452034",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:899914452034:web:4328acc17b612bb3cbf1db",
};

export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey);
};

export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey) return null;

  const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};
