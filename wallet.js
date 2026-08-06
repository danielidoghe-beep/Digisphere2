import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/*==================================
FIREBASE
==================================*/

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

/*==================================
ELEMENTS
==================================*/

const walletBalance =
document.getElementById("walletBalance");

const amountInput =
document.getElementById("amountInput");

const amountError =
document.getElementById("amountError");

const payButton =
document.getElementById("payButton");

const transactionsContainer =
document.getElementById("transactionsContainer");

const bankTransferTab =
document.getElementById("bankTransferTab");

const flutterwaveTab =
document.getElementById("flutterwaveTab");

const bankTransferModal =
document.getElementById("bankTransferModal");

const comingSoonModal =
document.getElementById("comingSoonModal");

const paymentAmount =
document.getElementById("paymentAmount");

const paymentCharge =
document.getElementById("paymentCharge");

const paymentTotal =
document.getElementById("paymentTotal");

const paymentReference =
document.getElementById("paymentReference");

const accountNumber =
document.getElementById("accountNumber");

const accountName =
document.getElementById("accountName");

const bankName =
document.getElementById("bankName");

/*==================================
VARIABLES
==================================*/

let currentUser = null;

let currentWallet = 0;

let selectedAmount = 0;

let charge = 0;

let total = 0;

/*==================================
AUTH
==================================*/

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="signin.html";

        return;

    }

    currentUser = user;

    loadWallet();

    loadTransactions();

});
/*==================================
LOAD WALLET
==================================*/

async function loadWallet(){

    try{

        const userRef = doc(db,"users",currentUser.uid);

        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()) return;

        const data = userSnap.data();

        currentWallet = Number(data.wallet || 0);

        walletBalance.textContent =
        "₦" + currentWallet.toLocaleString();

    }catch(error){

        console.error(error);

    }

}

/*==================================
LOAD TRANSACTIONS
==================================*/

function loadTransactions(){

    const transactionsRef = query(

        collection(
            db,
            "users",
            currentUser.uid,
            "transactions"
        ),

        orderBy("createdAt","desc")

    );

    onSnapshot(transactionsRef,(snapshot)=>{

        transactionsContainer.innerHTML="";

        if(snapshot.empty){

            transactionsContainer.innerHTML=`

            <div class="empty-transactions">

                <i class="fa-solid fa-wallet"></i>

                <h3>

                    No Transactions Yet

                </h3>

                <p>

                    Your wallet history will appear here.

                </p>

            </div>

            `;

            return;

        }

        snapshot.forEach((docSnap)=>{

            const tx = docSnap.data();

            const amount = Number(tx.amount || 0);

            const status =
            (tx.status || "Pending").toLowerCase();

            let icon = "fa-wallet";

            if(tx.type==="Deposit"){

                icon="fa-arrow-down";

            }

            if(tx.type==="Purchase"){

                icon="fa-cart-shopping";

            }

            transactionsContainer.innerHTML += `

            <div class="transaction-card">

                <div class="transaction-left">

                    <div class="transaction-icon">

                        <i class="fa-solid ${icon}"></i>

                    </div>

                    <div class="transaction-info">

                        <h3>

                            ${tx.type || "Transaction"}

                        </h3>

                        <p>

                            ${tx.reference || ""}

                        </p>

                    </div>

                </div>

                <div class="transaction-right">

                    <h4>

                        ₦${amount.toLocaleString()}

                    </h4>

                    <span class="transaction-status ${status}">

                        ${tx.status || "Pending"}

                    </span>

                </div>

            </div>

            `;

        });

    });

}
/*==================================
QUICK AMOUNT BUTTONS
==================================*/

const quickButtons =
document.querySelectorAll(".quick-amount");

quickButtons.forEach((button)=>{

    button.addEventListener("click",()=>{

        quickButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        amountInput.value =

        button.dataset.amount;

        validateAmount();

    });

});

/*==================================
AMOUNT INPUT
==================================*/

amountInput.addEventListener("input",()=>{

    quickButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    validateAmount();

});

/*==================================
VALIDATE AMOUNT
==================================*/

function validateAmount(){

    selectedAmount =

    Number(amountInput.value || 0);

    if(selectedAmount < 1000){

        amountError.classList.add("show");

        payButton.disabled = true;

        charge = 0;

        total = 0;

        return;

    }

    amountError.classList.remove("show");

    payButton.disabled = false;

    calculateCharges();

}

/*==================================
CALCULATE CHARGES
==================================*/

function calculateCharges(){

    charge = Math.ceil(selectedAmount * 0.01);

    total = selectedAmount + charge;

}

/*==================================
AUTO FILL AMOUNT
==================================*/

const params =

new URLSearchParams(window.location.search);

const requestedAmount =

Number(params.get("amount") || 0);

if(requestedAmount >= 1000){

    amountInput.value = requestedAmount;

    validateAmount();

}
/*==================================
BANK DETAILS
==================================*/

const BANK_NAME = "YOUR_BANK_NAME";

const ACCOUNT_NUMBER = "YOUR_ACCOUNT_NUMBER";

const ACCOUNT_NAME = "YOUR_ACCOUNT_NAME";

/*==================================
OPEN PAYMENT
==================================*/

payButton.addEventListener("click",()=>{

    if(selectedAmount < 1000){

        amountError.classList.add("show");

        return;

    }

    paymentAmount.textContent =
    "₦" + selectedAmount.toLocaleString();

    paymentCharge.textContent =
    "₦" + charge.toLocaleString();

    paymentTotal.textContent =
    "₦" + total.toLocaleString();

    bankName.textContent = palmpay;

    accountNumber.value = 9117412352;

    accountName.textContent = Ogaga Blessing Idoghe;

    paymentReference.value =
    generateReference();

    bankTransferModal.classList.add("show");

});

/*==================================
GENERATE REFERENCE
==================================*/

function generateReference(){

    const random =

    Math.floor(

        100000 + Math.random() * 900000

    );

    return "DS" + Date.now() + random;

}

/*==================================
CLOSE PAYMENT
==================================*/

document
.getElementById("closePayment")
.onclick=()=>{

    bankTransferModal.classList.remove("show");

};

document
.getElementById("cancelPayment")
.onclick=()=>{

    bankTransferModal.classList.remove("show");

};

bankTransferModal.onclick=(e)=>{

    if(e.target===bankTransferModal){

        bankTransferModal.classList.remove("show");

    }

};

/*==================================
COPY REFERENCE
==================================*/

document
.getElementById("copyReference")
.onclick=async()=>{

    await navigator.clipboard.writeText(

        paymentReference.value

    );

    alert("Reference copied.");

};

/*==================================
COPY ACCOUNT
==================================*/

document
.getElementById("copyAccount")
.onclick=async()=>{

    await navigator.clipboard.writeText(

        ACCOUNT_NUMBER

    );

    alert("Account number copied.");

};
/*==================================
I'VE MADE PAYMENT
==================================*/

const madePayment =
document.getElementById("madePayment");

/*==================================
YOUR WHATSAPP
==================================*/

const WHATSAPP_NUMBER =
"2349117412352";

madePayment.onclick = async()=>{

    const reference =
    paymentReference.value;

    /*-------------------------
    SAVE REQUEST
    -------------------------*/

    await addDoc(

        collection(db,"deposit_requests"),

        {

            uid:currentUser.uid,

            amount:selectedAmount,

            charge:charge,

            total:total,

            reference:reference,

            status:"Pending",

            createdAt:serverTimestamp()

        }

    );

    /*-------------------------
    WHATSAPP MESSAGE
    -------------------------*/

    const message=

`Hello DigiSphere,

I have made a wallet deposit.

Reference: ${reference}

Deposit Amount: ₦${selectedAmount.toLocaleString()}

Amount Sent: ₦${total.toLocaleString()}

Kindly confirm my payment.

I have attached my payment receipt.

Thank you.`;

    const url=

`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url,"_blank");

    bankTransferModal.classList.remove("show");

    alert(

"Your payment request has been submitted.\n\nPlease send your payment receipt on WhatsApp."

    );

};
