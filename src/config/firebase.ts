// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTP6rFbuWE4eTcCqC7LgO-xZ2-ZQk-BVw",
  authDomain: "mumumsit158.firebaseapp.com",
  projectId: "mumumsit158",
  storageBucket: "mumumsit158.appspot.com",
  messagingSenderId: "449815238767",
  appId: "1:449815238767:web:9c9e9b7c713657a5cf959a",
  measurementId: "G-4F98MKZZPC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const GoogleProvide = new GoogleAuthProvider();

const analytics = getAnalytics(app);
