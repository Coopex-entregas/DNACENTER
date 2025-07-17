// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔧 Substitua com os dados reais do seu projeto no Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxx", // sua chave real
  authDomain: "nomedoprojeto.firebaseapp.com",
  projectId: "nomedoprojeto",
  storageBucket: "nomedoprojeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcde123456"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Exporta os módulos para os arquivos .js que usam
export {
  app,
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
};
