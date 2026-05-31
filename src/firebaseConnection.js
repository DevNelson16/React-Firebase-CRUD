import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD_C2d3Njeq6YW0MDVuPyBQ1SRgI5nnfhs",
  authDomain: "teste-45492.firebaseapp.com",
  projectId: "teste-45492",
  storageBucket: "teste-45492.firebasestorage.app",
  messagingSenderId: "443377578694",
  appId: "1:443377578694:web:4ec522c912e3c10df81dc7",
  measurementId: "G-X11NBNFT7F"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {db, auth};