import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCocTCNbmDj8b5fOrh5g7W_0YghJ8n9niE",
  authDomain: "earnpoint-76792.firebaseapp.com",
  projectId: "earnpoint-76792",
  storageBucket: "earnpoint-76792.appspot.com",
  messagingSenderId: "88961998597",
  appId: "1:88961998597:web:1cf6237d002b5eedb9a16c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
