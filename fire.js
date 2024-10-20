
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";     


const firebaseConfig = {
  apiKey: "AIzaSyDJpGSCAG4fkaZuGQxj-shLxetkTLEe1Pg",
  authDomain: "donation-ce305.firebaseapp.com",
  projectId: "donation-ce305",
  storageBucket: "donation-ce305.appspot.com",
  messagingSenderId: "1018643478007",
  appId: "1:1018643478007:web:dd1d2564b185101d306af2",
  measurementId: "G-QGM896CT4W"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);     
const storage = getStorage(app); 

export { db, storage };
