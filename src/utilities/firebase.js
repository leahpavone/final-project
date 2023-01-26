// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDravYKtsPREDPbnzSKCK9WfolyUXbB5ZE",
  authDomain: "final-project-42d93.firebaseapp.com",
  projectId: "final-project-42d93",
  storageBucket: "final-project-42d93.appspot.com",
  messagingSenderId: "1093131695231",
  appId: "1:1093131695231:web:ca15c1f204689df6e2fb4a",
  measurementId: "G-63BGZGFENB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectStorageEmulator(storage, "localhost", 9199);
}

export { app, auth, db, storage };
