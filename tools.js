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
    where,
    onSnapshot,
    orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/*=========================
FIREBASE CONFIG
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

const profileLetter = document.getElementById("profileLetter");

const notificationCount = document.getElementById("notificationCount");

const toolCount = document.getElementById("toolCount");

const categoryContainer = document.getElementById("categoryContainer");

const toolsContainer = document.getElementById("toolsContainer");

const searchInput = document.getElementById("searchInput");

const menuBtn = document.getElementById("menuBtn");
/*=========================
BUY MODAL
=========================*/

const buyModal = document.getElementById("buyModal");

const buyImage = document.getElementById("buyImage");

const buyTitle = document.getElementById("buyTitle");

const buyPrice = document.getElementById("buyPrice");

const buyDescription = document.getElementById("buyDescription");

const cancelBuy = document.getElementById("cancelBuy");

const confirmBuy = document.getElementById("confirmBuy");

let selectedTool = null;
/*=========================
VARIABLES
=========================*/

let currentUser = null;

let currentWallet = 0;

let selectedCategory = "All";

let allTools = [];
/*=========================
AUTH
=========================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "signin.html";

        return;

    }

    currentUser = user;

    const snap = await getDoc(

        doc(db, "users", user.uid)

    );

    if (snap.exists()) {

        const data = snap.data();

        currentWallet = Number(data.wallet || 0);

        profileLetter.textContent =

            (data.name || "D")

            .charAt(0)

            .toUpperCase();

        notificationCount.textContent =

            data.notifications || 0;

    }

    loadTools();

});
/*=========================
LOAD TOOLS
=========================*/

function loadTools() {

    const q = query(

        collection(db, "tools"),

        where("active", "==", true),

        orderBy("createdAt", "desc")

    );

    onSnapshot(q, (snapshot) => {

        allTools = [];

        snapshot.forEach((docSnap) => {

            allTools.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        toolCount.textContent =

            allTools.length + " tools available";

        renderCategories();

        renderTools(allTools);

    });

}
/*=========================
RENDER TOOLS
=========================*/

function renderTools(products) {

    toolsContainer.innerHTML = "";

    if (products.length === 0) {

        toolsContainer.innerHTML = `

        <div class="empty-state">

            <h3>No tools available</h3>

            <p>Please check back later.</p>

        </div>

        `;

        return;

    }

    products.forEach((tool) => {

        toolsContainer.innerHTML += `

        <div class="tool-card">

            <img

            src="${tool.image}"

            class="tool-image">

            <div class="tool-content">

                <h2 class="tool-title">

                    ${tool.title}

                </h2>

                <p class="tool-description">

                    ${tool.description}

                </p>

                <div class="tool-bottom">

                    <span class="tool-price">

                        ₦${Number(tool.price).toLocaleString()}

                    </span>

                    <button

                    class="buy-btn"

                    data-id="${tool.id}">

                        BUY NOW

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    attachBuyButtons();

}
/*=========================
RENDER CATEGORIES
=========================*/

function renderCategories() {

    categoryContainer.innerHTML = "";

    const categories = ["All"];

    allTools.forEach((tool) => {

        if (
            tool.category &&
            !categories.includes(tool.category)
        ) {

            categories.push(tool.category);

        }

    });

    categories.forEach((category) => {

        categoryContainer.innerHTML += `

        <button

        class="category-btn ${category===selectedCategory?"active":""}"

        data-category="${category}">

            ${category}

        </button>

        `;

    });

    attachCategoryButtons();

}
/*=========================
CATEGORY BUTTONS
=========================*/

function attachCategoryButtons() {

    document.querySelectorAll(".category-btn").forEach((button) => {

        button.onclick = () => {

            selectedCategory = button.dataset.category;

            document.querySelectorAll(".category-btn").forEach((btn) => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            if (selectedCategory === "All") {

                renderTools(allTools);

                return;

            }

            const filtered = allTools.filter((tool) =>

                tool.category === selectedCategory

            );

            renderTools(filtered);

        };

    });

}
/*=========================
LIVE SEARCH
=========================*/

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value

        .toLowerCase()

        .trim();

    let filtered = allTools;

    // Apply category filter first
    if (selectedCategory !== "All") {

        filtered = filtered.filter((tool) =>

            tool.category === selectedCategory

        );

    }

    // Apply search
    filtered = filtered.filter((tool) =>

        (tool.title || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (tool.description || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (tool.category || "")
            .toLowerCase()
            .includes(keyword)

    );

    renderTools(filtered);

});
/*=========================
MENU BUTTON
=========================*/

menuBtn.onclick = () => {

    location.href = "dashboard.html";

};
if (products.length === 0) {

    toolsContainer.innerHTML = `

    <div class="empty-state">

        <i class="fa-solid fa-box-open"></i>

        <h3>No tools found</h3>

        <p>

            Try another keyword or category.

        </p>

    </div>

    `;

    return;

}
/*=========================
ATTACH BUY BUTTONS
=========================*/

function attachBuyButtons() {

    document.querySelectorAll(".buy-btn").forEach((button) => {

        button.onclick = () => {

            const id = button.dataset.id;

            selectedTool = allTools.find(

                tool => tool.id === id

            );

            if (!selectedTool) return;

            buyImage.src = selectedTool.image;

            buyTitle.textContent = selectedTool.title;

            buyPrice.textContent =

                "₦" +

                Number(selectedTool.price)

                .toLocaleString();

            buyDescription.textContent =

                selectedTool.description;

            buyModal.classList.add("show");

        };

    });

}
/*=========================
CLOSE BUY POPUP
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
BUY TOOL
=========================*/

confirmBuy.onclick = async () => {

    if (!selectedTool) return;

    const price = Number(selectedTool.price);

    /*-----------------------
    CHECK BALANCE
    -----------------------*/

    if (currentWallet < price) {

        const needed = price - currentWallet;

        alert(

            "Insufficient balance.\n\nDeposit ₦" +

            needed.toLocaleString() +

            " more."

        );

        location.href =

        "wallet.html?amount=" + needed;

        return;

    }

    /*-----------------------
    DEDUCT WALLET
    -----------------------*/

    const newBalance = currentWallet - price;

    await updateDoc(

        doc(db, "users", currentUser.uid),

        {

            wallet: newBalance

        }

    );

    currentWallet = newBalance;

    /*-----------------------
    SAVE PURCHASED TOOL
    -----------------------*/

    await addDoc(

        collection(

            db,

            "users",

            currentUser.uid,

            "purchasedTools"

        ),

        {

            title: selectedTool.title,

            description: selectedTool.description,

            image: selectedTool.image,

            category: selectedTool.category,

            price: selectedTool.price,

            downloadUrl: selectedTool.downloadUrl || "",

            notes: selectedTool.notes || "",

            purchasedAt: serverTimestamp()

        }

    );

    /*-----------------------
    SAVE ORDER
    -----------------------*/

    await addDoc(

        collection(

            db,

            "users",

            currentUser.uid,

            "orders"

        ),

        {

            productName: selectedTool.title,

            amount: price,

            status: "Approved",

            orderId: "ORD" + Date.now(),

            createdAt: serverTimestamp()

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

            type: "Tool Purchase",

            amount: price,

            status: "Approved",

            reference: "TRX" + Date.now(),

            createdAt: serverTimestamp()

        }

    );

    buyModal.classList.remove("show");

    alert("Purchase Successful.");

};
