import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbVLMs7FI0VO-tSo5F7Gs-eowyIOYCpsk",
  authDomain: "threes-2e801.firebaseapp.com",
  projectId: "threes-2e801",
  storageBucket: "threes-2e801.appspot.com",
  messagingSenderId: "307714708393",
  appId: "1:307714708393:web:bad557ab86e5c0988beab8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
