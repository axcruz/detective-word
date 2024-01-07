import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcxXPAZSNCKle8y6RFsQVqbeBikC4_ISg",
    authDomain: "detective-word.firebaseapp.com",
    projectId: "detective-word",
    storageBucket: "detective-word.appspot.com",
    messagingSenderId: "346558410967",
    appId: "1:346558410967:web:3c0a0a0afcf3e6dc854092",
    measurementId: "G-JSRE65RYTE"
  };

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
