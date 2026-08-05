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

const ordersList =
document.getElementById("ordersList");

/*==============================
      CHECK LOGIN
==============================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "signin.html";

        return;

    }

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

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

    loadOrders(user.uid);

});
/*==============================
        LOAD ORDERS
==============================*/

function loadOrders(uid) {

    const q = query(

        collection(db, "users", uid, "orders"),

        orderBy("createdAt", "desc")

    );

    onSnapshot(q, (snapshot) => {

        ordersList.innerHTML = "";

        if (snapshot.empty) {

            ordersList.innerHTML = `

            <div class="empty-order">

                <h3>No orders yet</h3>

                <p>

                    You have not made any purchases yet.

                </p>

            </div>

            `;

            return;

        }

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            const amount = Number(data.amount || 0);

            const status = (data.status || "Pending").toLowerCase();

            const statusClass =

                status === "approved"
                    ? "approved"
                    : status === "declined"
                    ? "declined"
                    : "pending";

            const statusText =

                status === "approved"
                    ? "Approved"
                    : status === "declined"
                    ? "Declined"
                    : "Pending";

            const date = data.createdAt?.toDate
                ? data.createdAt
                      .toDate()
                      .toLocaleDateString()
                : "Just now";

            ordersList.innerHTML += `

            <div class="order-item">

                <div class="order-title">

                    ${data.productName || "Digital Product"}

                </div>

                <div class="order-info">

                    ${data.orderId || "No Order ID"}

                    •

                    ${date}

                </div>

                <div class="order-bottom">

                    <div class="order-price">

                        ₦${amount.toLocaleString()}

                    </div>

                    <span class="order-status ${statusClass}">

                        ${statusText}

                    </span>

                </div>

            </div>

            `;

        });

    });

}
await addDoc(

    collection(db, "users", currentUser.uid, "orders"),

    {

        productName: product.name,

        orderId: "ORD" + Date.now(),

        amount: Number(product.price),

        status: "Approved",

        productType: product.category || "Digital Product",

        createdAt: serverTimestamp()

    }

);
