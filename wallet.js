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

/*====================================
            FIREBASE
====================================*/

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

/*====================================
            HTML
====================================*/

const walletBalance = document.getElementById("walletBalance");
const headerWalletBalance = document.getElementById("headerWalletBalance");
const bankName = document.getElementById("bankName");
const accountNumber = document.getElementById("accountNumber");
const paymentAmount2 = document.getElementById("paymentAmount2");
const profileLetter = document.getElementById("profileLetter");

const depositAmount = document.getElementById("depositAmount");

const bankTab = document.getElementById("bankTab");
const flutterwaveTab = document.getElementById("flutterwaveTab");

const openPaymentBtn = document.getElementById("openPaymentBtn");

const paymentModal = document.getElementById("paymentModal");
const paymentAmount = document.getElementById("paymentAmount");
const paymentReference = document.getElementById("paymentReference");

const sendReceiptBtn = document.getElementById("sendReceiptBtn");
const closePaymentModal = document.getElementById("closePaymentModal");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const transactionsList = document.getElementById("transactionsList");

/*====================================
            VARIABLES
====================================*/

let currentUser = null;
let paymentMethod = "bank";
/*====================================
        BANK DETAILS
====================================*/

const BANK_DETAILS = {
    bankName: "PalmPay",
    accountNumber: "9117412352",
    accountName: "Ogaga Blessing Idoghe",
    whatsapp: "2349117412352"
};
/*====================================
          AUTHENTICATION
====================================*/

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

        const balance = Number(data.wallet || 0);

        walletBalance.textContent =
            balance.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            });

        headerWalletBalance.textContent =
            balance.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            });

        if(data.name){

            profileLetter.textContent =
                data.name.charAt(0).toUpperCase();

        }

    }

    loadTransactions(user.uid);

});
/*====================================
            TOAST MESSAGE
====================================*/

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/*====================================
          QUICK AMOUNTS
====================================*/

document.querySelectorAll(".quick-btn").forEach((button) => {

    button.addEventListener("click", () => {

        depositAmount.value = button.dataset.amount;

    });

});

/*====================================
        PAYMENT METHOD
====================================*/

bankTab.addEventListener("click", () => {

    paymentMethod = "bank";

    bankTab.classList.add("active");
    flutterwaveTab.classList.remove("active");

    openPaymentBtn.disabled = false;

    openPaymentBtn.textContent = "OPEN PAYMENT";

});

flutterwaveTab.addEventListener("click", () => {

    paymentMethod = "flutterwave";

    flutterwaveTab.classList.add("active");
    bankTab.classList.remove("active");

    openPaymentBtn.disabled = true;

    openPaymentBtn.textContent = "PAY WITH FLUTTERWAVE";

    showToast("Flutterwave payment coming soon.");

});
/*====================================
          OPEN PAYMENT
====================================*/

openPaymentBtn.addEventListener("click", async () => {

    if (paymentMethod === "flutterwave") {

        showToast("Flutterwave payment coming soon.");
        return;

    }

    const amount = Number(depositAmount.value);

    if (!amount || amount < 1000) {

        showToast("Minimum deposit is ₦1,000.");
        return;

    }

    openPaymentBtn.disabled = true;
    openPaymentBtn.textContent = "OPENING PAYMENT...";

    try {

        const reference = "DGS" + Date.now();

        paymentAmount.textContent =
            "₦" + amount.toLocaleString();

        paymentReference.textContent =
            reference;
     bankName.textContent = BANK_DETAILS.bankName;

accountNumber.textContent =
    BANK_DETAILS.accountNumber;

paymentAmount2.textContent =
    "₦" + amount.toLocaleString();
        await addDoc(

            collection(
                db,
                "users",
                currentUser.uid,
                "transactions"
            ),

            {

                type: "Wallet Deposit",

                amount: amount,

                method: "Bank Transfer",

                status: "Pending",

                reference: reference,

                createdAt: serverTimestamp()

            }

        );

        const whatsappMessage =

`Hello DigiSphere,

I have made a wallet deposit.

Reference: ${reference}

Amount: ₦${amount.toLocaleString()}

Please find my payment receipt attached.`;

        sendReceiptBtn.href =
`https://wa.me/${BANK_DETAILS.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

        paymentModal.classList.add("show");

    } catch (error) {

        console.error(error);

        showToast("Unable to create payment. Please try again.");

    }

    openPaymentBtn.disabled = false;

    openPaymentBtn.textContent = "OPEN PAYMENT";

});
/*====================================
        LOAD TRANSACTIONS
====================================*/

function loadTransactions(uid) {

    const transactionsRef = query(

        collection(db, "users", uid, "transactions"),

        orderBy("createdAt", "desc")

    );

    onSnapshot(transactionsRef, (snapshot) => {

        transactionsList.innerHTML = "";

        if (snapshot.empty) {

            transactionsList.innerHTML = `

                <div class="transaction-card">

                    <div class="transaction-icon">

                        <i class="fa-solid fa-arrow-down"></i>

                    </div>

                    <div class="transaction-details">

                        <h3>No Transactions</h3>

                        <p>Your transactions will appear here.</p>

                    </div>

                    <div class="transaction-right">

                        <span class="transaction-amount">
                            ₦0.00
                        </span>

                    </div>

                </div>

            `;

            return;

        }

        snapshot.forEach((doc) => {

            const data = doc.data();

            const amount = Number(data.amount || 0);

            const date = data.createdAt
                ? data.createdAt.toDate().toLocaleDateString()
                : "Just now";

            let statusClass = "pending";

            if (data.status === "Approved") {

                statusClass = "approved";

            }

            if (data.status === "Declined") {

                statusClass = "declined";

            }

            transactionsList.innerHTML += `

                <div class="transaction-card">

                    <div class="transaction-icon">

                        <i class="fa-solid fa-arrow-down"></i>

                    </div>

                    <div class="transaction-details">

                        <h3>${data.type}</h3>

                        <p>

                            ${data.reference}

                            •

                            ${date}

                        </p>

                    </div>

                    <div class="transaction-right">

                        <span class="transaction-amount">

                            ₦${amount.toLocaleString()}

                        </span>

                        <span class="transaction-status ${statusClass}">

                            ${data.status}

                        </span>

                    </div>

                </div>

            `;

        });

    });

}
/*====================================
        CLOSE PAYMENT POPUP
====================================*/

closePaymentModal.addEventListener("click", () => {

    paymentModal.classList.remove("show");

});

paymentModal.addEventListener("click", (event) => {

    if (event.target === paymentModal) {

        paymentModal.classList.remove("show");

    }

});

/*====================================
        SEND RECEIPT
====================================*/

sendReceiptBtn.addEventListener("click", () => {

    showToast("Opening WhatsApp...");

});

/*====================================
        RESET BUTTON
====================================*/

window.addEventListener("pageshow", () => {

    openPaymentBtn.disabled = false;

    if (paymentMethod === "bank") {

        openPaymentBtn.textContent = "OPEN PAYMENT";

    }

});
/*====================================
        COPY BUTTONS
====================================*/

document.querySelectorAll(".copy-btn").forEach(button => {

    button.addEventListener("click", () => {

        const target =
            document.getElementById(button.dataset.copy);

        navigator.clipboard.writeText(target.textContent);

        showToast("Copied successfully.");

    });

});
/*====================================
            FINISHED
====================================*/

console.log("Wallet page loaded successfully.");
