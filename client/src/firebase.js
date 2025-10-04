// Firebase initialization for client-side only
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCyRazYDfjrm2b0f3nIJfwmJQJD6dwV8No",
  authDomain: "iedc-fd935.firebaseapp.com",
  projectId: "iedc-fd935",
  storageBucket: "iedc-fd935.firebasestorage.app",
  messagingSenderId: "96796509638",
  appId: "1:96796509638:web:3938d28da6649390a49ec7",
  measurementId: "G-Y47RZVMQGT",
};

let analytics = null;

export const app = initializeApp(firebaseConfig);

export const initAnalytics = async () => {
  if (typeof window === "undefined") return null;
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
      return analytics;
    }
  } catch (_) {
    // ignore analytics failures
  }
  return null;
};

export { analytics };
