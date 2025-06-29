import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwb1BNeumfGv84EspnXvM-7a_TvdKVu1I",
  authDomain: "my-inventory-project-9dccf.firebaseapp.com",
  projectId: "my-inventory-project-9dccf",
  storageBucket: "my-inventory-project-9dccf.firebasestorage.app",
  messagingSenderId: "283314401768",
  appId: "1:283314401768:web:a5920d23c8602de1a2745d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 