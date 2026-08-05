import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/*=========================
FIREBASE
=========================*/

const firebaseConfig = {

    apiKey: "AIzaSyDnpsEIlXwPLSCJAGMS7feM2JMhmxzCCfs",

    authDomain: "digisphere-66fdf.firebaseapp.com",

    projectId: "digisphere-66fdf",

    storageBucket: "digisphere-66fdf.firebasestorage.app",

    messagingSenderId: "834194884246",

    appId: "1:834194884246:web:72672ca253c3d7dd9d24b7",

    measurementId: "G-19QS4036V7"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

/*=========================
ELEMENTS
=========================*/

const backBtn = document.getElementById("backBtn");

const productImage = document.getElementById("productImage");

const platformIcon = document.getElementById("platformIcon");

const productTitle = document.getElementById("productTitle");

const productDescription = document.getElementById("productDescription");

const email = document.getElementById("email");

const password = document.getElementById("password");

const recoveryEmail = document.getElementById("recoveryEmail");

const recoveryPassword = document.getElementById("recoveryPassword");

const twoFactor = document.getElementById("twoFactor");

const cookies = document.getElementById("cookies");

const notes = document.getElementById("notes");

const togglePassword = document.getElementById("togglePassword");

/*=========================
BACK BUTTON
=========================*/

backBtn.onclick = () => {

    history.back();

};

/*=========================
GET DOCUMENT ID
=========================*/

const params = new URLSearchParams(window.location.search);

const documentId = params.get("id");

/*=========================
LOAD PRODUCT
=========================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "signin.html";

        return;

    }

    if (!documentId) {

        alert("Product not found.");

        history.back();

        return;

    }

    const productRef = doc(

        db,

        "users",

        user.uid,

        "inventory",

        documentId

    );

    const snap = await getDoc(productRef);

    if (!snap.exists()) {

        alert("Product not found.");

        history.back();

        return;

    }

    const data = snap.data();

    productImage.src = data.image || "";

    platformIcon.src =
        "images/platforms/" +
        (data.platform || "default")
        .toLowerCase()
        .replace(/\s+/g, "") +
        ".png";

    productTitle.textContent = data.title || "";

    productDescription.textContent = data.description || "";

    email.value = data.email || "";

    password.value = data.password || "";

    recoveryEmail.value = data.recoveryEmail || "";

    recoveryPassword.value = data.recoveryPassword || "";

    twoFactor.value = data.twoFactor || "";

    cookies.value = data.cookies || "";

    notes.value = data.notes || "";

});
/*=========================
COPY BUTTONS
=========================*/

document.querySelectorAll(".copy-btn").forEach((button) => {

    button.onclick = () => {

        const input = document.getElementById(

            button.dataset.copy

        );

        navigator.clipboard.writeText(input.value);

        button.textContent = "Copied";

        setTimeout(() => {

            button.textContent = "Copy";

        }, 1500);

    };

});
/*=========================
SHOW PASSWORD
=========================*/

togglePassword.onclick = () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        password.type = "password";

        togglePassword.textContent = "Show";

    }

};
