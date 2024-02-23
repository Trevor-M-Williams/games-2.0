import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC54VyfSPZ1ZK8GC8zeimx3_ozevlyr11Q",
  authDomain: "threes-dev.firebaseapp.com",
  projectId: "threes-dev",
  storageBucket: "threes-dev.appspot.com",
  messagingSenderId: "175425727284",
  appId: "1:175425727284:web:3239fe949933f3e396d361",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
