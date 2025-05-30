import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCuZI8fQiKID9VOCyojPIxI2b9Oxxzlgb0",
  authDomain: "zentra-30b87.firebaseapp.com",
  projectId: "zentra-30b87",
  storageBucket: "zentra-30b87.firebasestorage.app",
  messagingSenderId: "960124465885",
  appId: "1:960124465885:web:5e5ce1a60ef3d30ef06134",
  databaseURL: "https://zentra-30b87-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rtdb = getDatabase(app);

export { auth, rtdb };
