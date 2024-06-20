import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBq2B0XoLssViDgCT-9DNXoK-DYtOcSLkQ",
  authDomain: "reactchat-ed6f5.firebaseapp.com",
  projectId: "reactchat-ed6f5",
  storageBucket: "reactchat-ed6f5.appspot.com",
  messagingSenderId: "1070059764970",
  appId: "1:1070059764970:web:bd2bb472fd02cc59566b93"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)