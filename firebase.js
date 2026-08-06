// ==========================================
// FIREBASE CONFIG
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDnpsEIlXwPLSCJAGMS7feM2JMhmxzCCfs",

    authDomain: "digisphere-66fdf.firebaseapp.com",

    projectId: "digisphere-66fdf",

    storageBucket: "digisphere-66fdf.firebasestorage.app",

    messagingSenderId: "834194884246",

    appId: "1:834194884246:web:72672ca253c3d7dd9d24b7",

    measurementId: "G-19QS4036V7"

};

// ==========================================
// INITIALIZE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// ==========================================
// EXPORTS
// ==========================================

export {

    app,

    auth,

    db,

    provider,

    onAuthStateChanged,

    signOut,

    doc,

    getDoc,

    getDocs,

    setDoc,

    addDoc,

    updateDoc,

    deleteDoc,

    collection,

    query,

    where,

    orderBy,

    limit,

    onSnapshot,

    serverTimestamp

};
