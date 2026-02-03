import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTollFwrtQChqWRCzOF3CTQFUGDcv-skc",
    authDomain: "finan-4854e.firebaseapp.com",
    databaseURL: "https://finan-4854e-default-rtdb.firebaseio.com",
    projectId: "finan-4854e",
    storageBucket: "finan-4854e.firebasestorage.app",
    messagingSenderId: "911532524791",
    appId: "1:911532524791:web:8c9530465db84a9e187ff2",
    measurementId: "G-98QF2CPMTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
