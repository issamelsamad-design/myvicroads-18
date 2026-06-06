import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTkxyp2_PRmpNJTtF471Q4nkzXR52TxNg",
  authDomain: "myvicroads-b00e2.firebaseapp.com",
  projectId: "myvicroads-b00e2",
  storageBucket: "myvicroads-b00e2.firebasestorage.app",
  messagingSenderId: "190865323094",
  appId: "1:190865323094:web:578f6f0e7d88bb2d9977f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
