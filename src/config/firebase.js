import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDRPl5CrYHIb-36OkOBxAoLcjb7z9Q9qLQ",
  authDomain: "registerville-88b5d.firebaseapp.com",
  databaseURL: "https://registerville-88b5d-default-rtdb.firebaseio.com",
  projectId: "registerville-88b5d",
  storageBucket: "registerville-88b5d.firebasestorage.app",
  messagingSenderId: "233154875068",
  appId: "1:233154875068:web:15c8640e2f944ab1e08ab9",
  measurementId: "G-CE3F6YLY97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);