// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVej7uIxb6L24lyd7LLZikUzv-MPNAqtY",
  authDomain: "the-gourmet-spot.firebaseapp.com",
  projectId: "the-gourmet-spot",
  storageBucket: "the-gourmet-spot.firebasestorage.app",
  messagingSenderId: "495775898338",
  appId: "1:495775898338:web:cfc35b0c7e1e6e01e4dcbb"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const db = getFirestore();
export const auth = getAuth();


// import { initializeApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDVej7uIxb6L24lyd7LLZikUzv-MPNAqtY",
//   authDomain: "the-gourmet-spot.firebaseapp.com",
//   projectId: "the-gourmet-spot",
//   storageBucket: "the-gourmet-spot.appspot.com",  // ✅ FIXED
//   messagingSenderId: "495775898338",
//   appId: "1:495775898338:web:cfc35b0c7e1e6e01e4dcbb"
// };

// const app = !getApps().length ?
