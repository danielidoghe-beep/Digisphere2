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
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
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
        ELEMENTS
==============================*/

const walletBalance = document.getElementById("walletBalance");
const headerWalletBalance = document.getElementById("headerWalletBalance");

const profileLetter = document.getElementById("profileLetter");

const notificationCount = document.getElementById("notificationCount");

const depositAmount = document.getElementById("depositAmount");

const openPaymentBtn = document.getElementById("openPaymentBtn");

const bankTab = document.getElementById("bankTab");
const flutterwaveTab = document.getElementById("flutterwaveTab");

const paymentModal = document.getElementById("paymentModal");

const paymentAmount = document.getElementById("paymentAmount");

const paymentReference = document.getElementById("paymentReference");

const sendReceiptBtn = document.getElementById("sendReceiptBtn");

const closePaymentModal = document.getElementById("closePaymentModal");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

const transactionsList = document.getElementById("transactionsList");

/*==============================
        VARIABLES
==============================*/

let currentUser = null;

let paymentMethod = "bank";
/*==============================
      AUTHENTICATION
==============================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "signin.html";

        return;

    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

        const data = userSnap.data();

        const balance = data.wallet || 0;

        walletBalance.textContent = balance.toFixed(2);

        headerWalletBalance.textContent = balance.toFixed(2);

        if (data.name) {

            profileLetter.textContent =
                data.name.charAt(0).toUpperCase();

        }

    }

    loadTransactions(user.uid);

});
/*==============================
        TOAST MESSAGE
==============================*/

function showToast(message){

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}

/*==============================
      PAYMENT METHOD
==============================*/

bankTab.addEventListener("click",()=>{

    paymentMethod="bank";

    bankTab.classList.add("active");

    flutterwaveTab.classList.remove("active");

    openPaymentBtn.disabled=false;

    openPaymentBtn.textContent="OPEN PAYMENT";

});

flutterwaveTab.addEventListener("click",()=>{

    paymentMethod="flutterwave";

    flutterwaveTab.classList.add("active");

    bankTab.classList.remove("active");

    openPaymentBtn.disabled=true;

    openPaymentBtn.textContent="PAY WITH FLUTTERWAVE";

    showToast("Flutterwave payment coming soon.");

});

/*==============================
      OPEN PAYMENT
==============================*/

openPaymentBtn.addEventListener("click",async()=>{

    const amount=Number(depositAmount.value);

    if(amount<1000){

        showToast("Minimum deposit is ₦1,000.");

        return;

    }

    openPaymentBtn.textContent="OPENING PAYMENT...";

    openPaymentBtn.disabled=true;

    const reference="DGS"+Date.now();

    paymentAmount.textContent="₦"+amount.toLocaleString();

    paymentReference.textContent=reference;

    await addDoc(

        collection(db,"users",currentUser.uid,"transactions"),

        {

            type:"Wallet Deposit",

            amount:amount,

            reference:reference,

            method:"Bank Transfer",

            status:"Pending",

            createdAt:serverTimestamp()

        }

    );

    const whatsappMessage=

`Hello DigiSphere,

I have made a wallet deposit.

Reference: ${reference}

Amount: ₦${amount.toLocaleString()}

Please find my payment receipt attached.`;

    sendReceiptBtn.href=

`https://wa.me/2349117412352?text=${encodeURIComponent(whatsappMessage)}`;

    paymentModal.classList.add("show");

    openPaymentBtn.textContent="OPEN PAYMENT";

    openPaymentBtn.disabled=false;

});

/*==============================
      CLOSE POPUP
==============================*/

closePaymentModal.addEventListener("click",()=>{

    paymentModal.classList.remove("show");

});

paymentModal.addEventListener("click",(e)=>{

    if(e.target===paymentModal){

        paymentModal.classList.remove("show");

    }

});
`/*==============================
      LOAD TRANSACTIONS
==============================*/

function loadTransactions(uid){

    const q = query(

        collection(db,"users",uid,"transactions"),

        orderBy("createdAt","desc")

    );

    onSnapshot(q,(snapshot)=>{

        transactionsList.innerHTML = "";

        if(snapshot.empty){

            transactionsList.innerHTML = \`

            <div class="transaction-card">

                <div class="transaction-icon">

                    <i class="fa-solid fa-arrow-down"></i>

                </div>

                <div class="transaction-details">

                    <h3>Wallet Deposit</h3>

                    <p>No transactions yet</p>

                </div>

                <div class="transaction-right">

                    <span class="transaction-amount">₦0.00</span>

                    <span class="transaction-status pending">

                        Pending

                    </span>

                </div>

            </div>

            \`;

            return;

        }

        snapshot.forEach((docSnap)=>{

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
                ? data.createdAt.toDate().toLocaleDateString()
                : "Just now";

            transactionsList.innerHTML += \`

            <div class="transaction-card">

                <div class="transaction-icon">

                    <i class="fa-solid fa-arrow-down"></i>

                </div>

                <div class="transaction-details">

                    <h3>\${data.type || "Wallet Deposit"}</h3>

                    <p>

                        \${data.reference || "No reference"} · \${date}

                    </p>

                </div>

                <div class="transaction-right">

                    <span class="transaction-amount">

                        ₦\${amount.toLocaleString()}

                    </span>

                    <span class="transaction-status \${statusClass}">

                        \${statusText}

                    </span>

                </div>

            </div>

            \`;

        });

    });

}`
/*==============================
      QUICK AMOUNTS
==============================*/

document.querySelectorAll(".quick-btn").forEach((button)=>{

    button.addEventListener("click",()=>{

        depositAmount.value = button.dataset.amount;

    });

});
