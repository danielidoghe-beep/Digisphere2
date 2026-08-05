import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/*==============================
        FIREBASE CONFIG
==============================*/

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

/*==============================
        HTML ELEMENTS
==============================*/

const headerWalletBalance =
document.getElementById("headerWalletBalance");

const profileLetter =
document.getElementById("profileLetter");

const notificationCount =
document.getElementById("notificationCount");

const transactionsList =
document.getElementById("transactionsList");

const searchInput =
document.getElementById("searchInput");

const menuBtn =
document.getElementById("menuBtn");

/*==============================
      MENU BUTTON
==============================*/

menuBtn.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});

/*==============================
      CHECK LOGIN
==============================*/

let allTransactions = [];

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "signin.html";

        return;

    }

    const userSnap = await getDoc(

        doc(db, "users", user.uid)

    );

    if (userSnap.exists()) {

        const data = userSnap.data();

        headerWalletBalance.textContent =
            Number(data.wallet || 0).toLocaleString();

        profileLetter.textContent =
            (data.name || "U")
            .charAt(0)
            .toUpperCase();

        notificationCount.textContent =
            data.unreadNotifications || 0;

    }

    const q = query(

        collection(db, "users", user.uid, "transactions"),

        orderBy("createdAt", "desc")

    );

    onSnapshot(q, (snapshot) => {

        allTransactions = [];

        snapshot.forEach((doc) => {

            allTransactions.push(doc.data());

        });

        renderTransactions(allTransactions);

    });

});
/*==============================
      RENDER TRANSACTIONS
==============================*/

function renderTransactions(transactions) {

    transactionsList.innerHTML = "";

    if (transactions.length === 0) {

        transactionsList.innerHTML = `

        <div class="transaction-card">

            <div class="transaction-icon">

                <i class="fa-solid fa-clock"></i>

            </div>

            <div class="transaction-details">

                <h3>No transactions found</h3>

                <p>

                    You don't have any transactions yet.

                </p>

            </div>

        </div>

        `;

        return;

    }

    transactions.forEach((data) => {

        const amount = Number(data.amount || 0);

        const status = (data.status || "Pending").toLowerCase();

        let statusClass = "pending";

        let statusText = "Pending";

        if (status === "approved") {

            statusClass = "approved";

            statusText = "Approved";

        }

        if (status === "declined") {

            statusClass = "declined";

            statusText = "Declined";

        }

        const date = data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString()
            : "Just now";

        transactionsList.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-icon">

                <i class="fa-solid fa-wallet"></i>

            </div>

            <div class="transaction-details">

                <h3>

                    ${data.type || "Wallet Deposit"}

                </h3>

                <p>

                    ${data.reference || "No Reference"}

                    <br>

                    ${date}

                </p>

            </div>

            <div class="transaction-right">

                <span class="transaction-amount">

                    ₦${amount.toLocaleString()}

                </span>

                <span class="transaction-status ${statusClass}">

                    ${statusText}

                </span>

            </div>

        </div>

        `;

    });

}

/*==============================
      SEARCH
==============================*/

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = allTransactions.filter((item) => {

        return (

            (item.reference || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (item.type || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (item.status || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

    renderTransactions(filtered);

});
