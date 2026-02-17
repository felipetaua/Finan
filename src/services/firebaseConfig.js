import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
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

console.log("Firebase initialized. API Key exists:", !!firebaseConfig.apiKey);

const auth = Platform.OS === 'web' 
    ? getAuth(app) 
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });

export { db, auth, app, firebaseConfig };
