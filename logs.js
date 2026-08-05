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
where,
orderBy,
onSnapshot,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);

/*=========================
ELEMENTS
=========================*/

const menuBtn=document.getElementById("menuBtn");

const filterBtn=document.getElementById("filterBtn");

const categorySidebar=document.getElementById("categorySidebar");

const sidebarOverlay=document.getElementById("sidebarOverlay");

const closeSidebar=document.getElementById("closeSidebar");

const categoryList=document.getElementById("categoryList");

const productsContainer=document.getElementById("productsContainer");

const profileLetter=document.getElementById("profileLetter");

const notificationCount=document.getElementById("notificationCount");

const categorySearch=document.getElementById("categorySearch");

/*=========================
CURRENT USER
=========================*/

let currentUser=null;

let currentWallet=0;

let selectedCategory="All listings";

/*=========================
LOGIN
=========================*/

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="signin.html";

return;

}

currentUser=user;

const userDoc=await getDoc(doc(db,"users",user.uid));

if(userDoc.exists()){

const data=userDoc.data();

profileLetter.textContent=(data.name||"D")
.charAt(0)
.toUpperCase();

currentWallet=Number(data.wallet||0);

notificationCount.textContent=data.notifications||0;

}

loadCategories();

loadProducts();

});
/*=========================
PLATFORM ICONS
=========================*/

const platformIcons = {

facebook:"images/platforms/facebook.png",

instagram:"images/platforms/instagram.png",

twitter:"images/platforms/twitter.png",

x:"images/platforms/twitter.png",

tiktok:"images/platforms/tiktok.png",

telegram:"images/platforms/telegram.png",

gmail:"images/platforms/gmail.png",

netflix:"images/platforms/netflix.png",

spotify:"images/platforms/spotify.png",

discord:"images/platforms/discord.png",

expressvpn:"images/platforms/expressvpn.png",

nordvpn:"images/platforms/nordvpn.png",

piavpn:"images/platforms/pivpn.png",

protonvpn:"images/platforms/protonvpn.png",

default:"images/platforms/default.png"

};

/*=========================
LOAD PRODUCTS
=========================*/

function loadProducts(category="All listings"){

productsContainer.innerHTML="";

let productsRef=collection(db,"logs");

let q;

if(category==="All listings"){

q=query(productsRef,orderBy("createdAt","desc"));

}else{

q=query(

productsRef,

where("category","==",category),

orderBy("createdAt","desc")

);

}

onSnapshot(q,(snapshot)=>{

productsContainer.innerHTML="";

document.getElementById("listingCount").textContent=

snapshot.size+" accounts available";

if(snapshot.empty){

productsContainer.innerHTML=`

<div class="empty-state">

<h3>No products available</h3>

<p>Please check back later.</p>

</div>

`;

return;

}

snapshot.forEach(doc=>{

const data=doc.data();

const icon=

platformIcons[(data.platform||"").toLowerCase()]||

platformIcons.default;

productsContainer.innerHTML+=`

<div class="product-card">

<h3 class="category-title">

${data.category}

</h3>

<div class="stock">

${data.stock} in stock

</div>

<div class="product-box">

<img

src="${data.image}"

class="product-image">

<div class="product-info">

<img

src="${icon}"

class="platform-icon">

<div class="product-details">

<h2 class="product-name">

${data.title}

</h2>

<div class="product-price">

₦${Number(data.price).toLocaleString()}

</div>

<p class="product-description">

${data.description}

</p>

${
Number(data.stock) > 0

?

`<button

class="buy-btn"

data-id="${doc.id}">

BUY NOW

</button>`

:

`<button

class="buy-btn sold-out"

disabled>

OUT OF STOCK

</button>`

}
</div>

</div>

</div>

</div>

`;

});

attachBuyButtons();

});

}
/*=========================
BUY POPUP
=========================*/

const buyModal = document.getElementById("buyModal");

const buyImage = document.getElementById("buyImage");

const buyIcon = document.getElementById("buyIcon");

const buyTitle = document.getElementById("buyTitle");

const buyPrice = document.getElementById("buyPrice");

const buyDescription = document.getElementById("buyDescription");

const cancelBuy = document.getElementById("cancelBuy");

const confirmBuy = document.getElementById("confirmBuy");

let selectedProduct = null;

/*=========================
ATTACH BUY BUTTONS
=========================*/

function attachBuyButtons() {

    document.querySelectorAll(".buy-btn").forEach((button) => {

        button.onclick = async () => {

            const productId = button.dataset.id;

            const productRef = doc(db, "logs", productId);

            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) return;

            selectedProduct = {

                id: productId,

                ...productSnap.data()

            };

            const icon =

                platformIcons[
                    (selectedProduct.platform || "").toLowerCase()
                ] || platformIcons.default;

            buyImage.src = selectedProduct.image;

            buyIcon.src = icon;

            buyTitle.textContent = selectedProduct.title;

            buyPrice.textContent =
                "₦" +
                Number(selectedProduct.price).toLocaleString();

            buyDescription.textContent =
                selectedProduct.description;

            buyModal.classList.add("show");

        };

    });

}

/*=========================
CANCEL
=========================*/

cancelBuy.onclick = () => {

    buyModal.classList.remove("show");

};

buyModal.onclick = (e) => {

    if (e.target === buyModal) {

        buyModal.classList.remove("show");

    }

};

/*=========================
BUY PRODUCT
=========================*/

confirmBuy.onclick = async () => {

    if (!selectedProduct) return;

    const price = Number(selectedProduct.price);
if(Number(selectedProduct.stock)<=0){

alert("This product is out of stock.");

buyModal.classList.remove("show");

return;

}
    /*-----------------------
    INSUFFICIENT BALANCE
    -----------------------*/

    if (currentWallet < price) {

        const needed = price - currentWallet;

        alert(

            "Insufficient balance.\n\nDeposit ₦" +

            needed.toLocaleString() +

            " more."

        );

        window.location.href =

        "wallet.html?amount=" + needed;

        return;

    }

    /*-----------------------
    DEDUCT WALLET
    -----------------------*/

    const newBalance = currentWallet - price;

    await updateDoc(

        doc(db,"users",currentUser.uid),

        {

            wallet:newBalance

        }

    );

    /*-----------------------
    REDUCE STOCK
    -----------------------*/

    await updateDoc(

        doc(db,"logs",selectedProduct.id),

        {

            stock:selectedProduct.stock-1

        }

    );

    /*-----------------------
    SAVE ORDER
    -----------------------*/

    await addDoc(

        collection(db,

        "users",

        currentUser.uid,

        "orders"),

        {

            productName:selectedProduct.title,

            amount:price,

            status:"Approved",

            orderId:"ORD"+Date.now(),

            createdAt:serverTimestamp()

        }

    );

    /*-----------------------
    SAVE TRANSACTION
    -----------------------*/

    await addDoc(

        collection(

        db,

        "users",

        currentUser.uid,

        "transactions"

        ),

        {

            type:"Purchase",

            amount:price,

            status:"Approved",

            reference:"TRX"+Date.now(),

            createdAt:serverTimestamp()

        }

    );

    /*-----------------------
    SAVE INVENTORY
    -----------------------*/

    await addDoc(

collection(

db,

"users",

currentUser.uid,

"inventory"

),

{

title:selectedProduct.title,

description:selectedProduct.description,

image:selectedProduct.image,

platform:selectedProduct.platform,

price:selectedProduct.price,

email:selectedProduct.email || "",

password:selectedProduct.password || "",

recoveryEmail:selectedProduct.recoveryEmail || "",

recoveryPassword:selectedProduct.recoveryPassword || "",

twoFactor:selectedProduct.twoFactor || "",

cookies:selectedProduct.cookies || "",

notes:selectedProduct.notes || "",

purchasedAt:serverTimestamp()

}

);

    currentWallet=newBalance;

    buyModal.classList.remove("show");

    alert("Purchase Successful.");

};
/*=========================
MENU BUTTON
=========================*/

menuBtn.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});
/*=========================
OPEN FILTER SIDEBAR
=========================*/

filterBtn.addEventListener("click", () => {

    categorySidebar.classList.add("show");

    sidebarOverlay.classList.add("show");

});
/*=========================
CLOSE SIDEBAR
=========================*/

closeSidebar.addEventListener("click", () => {

    categorySidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

});

sidebarOverlay.addEventListener("click", () => {

    categorySidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

});
/*=========================
LOAD CATEGORIES
=========================*/

function loadCategories() {

    const categories = [

        "All listings",

        "Facebook",

        "Instagram",

        "TikTok",

        "Twitter",

        "Telegram",

        "Netflix",

        "VPN"

    ];

    categoryList.innerHTML = "";

    categories.forEach(category => {

        categoryList.innerHTML += `

        <button class="category-item">

            ${category}

        </button>

        `;

    });

    document.querySelectorAll(".category-item").forEach(button => {

        button.onclick = () => {

            selectedCategory = button.textContent.trim();

            loadProducts(selectedCategory);

            categorySidebar.classList.remove("show");

            sidebarOverlay.classList.remove("show");

        };

    });

}
/*=========================
SEARCH CATEGORY
=========================*/

categorySearch.addEventListener("input", () => {

    const search = categorySearch.value.toLowerCase();

    document.querySelectorAll(".category-item").forEach(item => {

        item.style.display =

            item.textContent.toLowerCase().includes(search)

            ? "block"

            : "none";

    });

});
