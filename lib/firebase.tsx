// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjcWXjSY5V8LvVnzs4igU_4H41PTHkTC4",
  authDomain: "autodemy-936fa.firebaseapp.com",
  projectId: "autodemy-936fa",
  storageBucket: "autodemy-936fa.firebasestorage.app",
  messagingSenderId: "1006800299675",
  appId: "1:1006800299675:web:ee6b9206ca1d0add14483e",
  measurementId: "G-19S3HHQFBZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
