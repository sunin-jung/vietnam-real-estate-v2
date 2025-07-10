import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDToqqzMLHHpgiLymSKBdfSDT4C2svUaYA",
  authDomain: "vietnam-3138b.firebaseapp.com",
  projectId: "vietnam-3138b",
  storageBucket: "vietnam-3138b.appspot.com",
  messagingSenderId: "370356802729",
  appId: "1:370356802729:web:1a2fdc4f0083a14ab685b8",
  measurementId: "G-L736NRX3R8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app); 