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
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/* Firebase */

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

/* HTML */

const userName = document.getElementById("userName");

const walletBalance = document.getElementById("walletBalance");

const headerWallet = document.getElementById("headerWallet");

const purchaseCount = document.getElementById("purchaseCount");

const inventoryTotal = document.getElementById("inventoryTotal");

const inventoryText = document.getElementById("inventoryText");

const profileLetter = document.getElementById("profileLetter");

const notificationBtn = document.getElementById("notificationBtn");

const notificationPopup = document.getElementById("notificationPopup");

const notificationList = document.getElementById("notificationList");

const notificationCount = document.getElementById("notificationCount");

const markRead = document.getElementById("markRead");
/* ===========================
      CHECK LOGIN
=========================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "signin.html";

        return;

    }

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

        const data = userSnap.data();

        /* User Name */

        userName.textContent =
            data.name ||
            user.displayName ||
            "User";

        /* Profile Letter */

        profileLetter.textContent =
            (data.name || user.displayName || "U")
            .charAt(0)
            .toUpperCase();

        /* Wallet */

        const wallet = Number(data.wallet || 0);

        walletBalance.textContent =
            wallet.toLocaleString();

        headerWallet.textContent =
            wallet.toLocaleString();

        /* Purchases */

        purchaseCount.textContent =
            data.totalPurchases || 0;

        /* Inventory */

        inventoryTotal.textContent =
            data.inventory || 0;

        inventoryText.textContent =
            `${data.logs || 0} Logs • ${data.tools || 0} Tools`;

    } else {

        userName.textContent =
            user.displayName || "User";

        profileLetter.textContent =
            (user.displayName || "U")
            .charAt(0)
            .toUpperCase();

    }

    loadNotifications(user.uid);

});
/* ===========================
      NOTIFICATIONS
=========================== */

async function loadNotifications(uid) {

    notificationList.innerHTML = "";

    let unread = 0;

    const notificationsRef = collection(
        db,
        "users",
        uid,
        "notifications"
    );

    const q = query(
        notificationsRef,
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        notificationList.innerHTML = `
            <div class="notify-card">
                <h4>No notifications</h4>
                <p>You don't have any notifications yet.</p>
            </div>
        `;

        notificationCount.textContent = "0";

        return;

    }

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        if (!data.read) unread++;

        notificationList.innerHTML += `

            <div class="notify-card">

                <h4>${data.title || "Notification"}</h4>

                <p>${data.message || ""}</p>

                <small>${data.time || "Just now"}</small>

            </div>

        `;

    });

    notificationCount.textContent = unread;

}

/* ===========================
      POPUP
=========================== */

notificationBtn.addEventListener("click", () => {

    notificationPopup.classList.toggle("show");

});

/* Close popup when clicking outside */

document.addEventListener("click", (e) => {

    if (
        !notificationPopup.contains(e.target) &&
        !notificationBtn.contains(e.target)
    ) {

        notificationPopup.classList.remove("show");

    }

});

/* ===========================
      MARK ALL READ
=========================== */

markRead.addEventListener("click", () => {

    notificationCount.textContent = "0";

});
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("show");
    sidebarOverlay.classList.add("show");
});

sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
});
