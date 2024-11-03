// FIREBASE....

import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIbqnRHeaSwXgxf5-lP-vic5gWUGSpWZY",
  authDomain: "documentapp-ee002.firebaseapp.com",
  projectId: "documentapp-ee002",
  storageBucket: "documentapp-ee002.firebasestorage.app",
  messagingSenderId: "83013757790",
  appId: "1:83013757790:web:e343aeb3406b50fb9bfdcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
