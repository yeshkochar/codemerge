import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "saarthi-c59a1.firebaseapp.com",
  projectId: "saarthi-c59a1",
  storageBucket: "saarthi-c59a1.appspot.com",
  messagingSenderId: "744408851476",
  appId: "1:744408851476:web:02fe2c7bc04b3a41f0b301",
  measurementId: "G-0ZJ8GYVFX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 