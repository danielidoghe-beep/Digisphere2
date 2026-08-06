// ==========================================
// IMPORTS
// ==========================================

import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot
} from "./firebase.js";

// ==========================================
// ELEMENTS
// ==========================================
const markAllRead = document.getElementById("markAllRead");
const loadingScreen = document.getElementById("loading-screen");
const dashboardPage = document.getElementById("dashboard-page");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");

const profileInitial = document.getElementById("profileInitial");

const userName = document.getElementById("userName");

const walletBalance = document.getElementById("walletBalance");
const topWallet = document.getElementById("topWallet");

const purchaseCount = document.getElementById("purchaseCount");

const inventoryCount = document.getElementById("inventoryCount");
const inventoryBreakdown = document.getElementById("inventoryBreakdown");

const notificationBadge = document.getElementById("notificationCount");
const notificationList = document.getElementById("notificationList");

const adminPanel = document.getElementById("adminPanel");

const logoutBtn = document.getElementById("logoutBtn");
// ==========================================
// LOADING SCREEN
// ==========================================

function showDashboard() {

    setTimeout(() => {

        loadingScreen.style.display = "none";

        dashboardPage.classList.remove("hidden");

    }, 2500);

}
// ==========================================
// SIDEBAR
// ==========================================

menuBtn.addEventListener("click", () => {

    sidebar.classList.add("active");

    sidebarOverlay.classList.add("active");

});

sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

});
// ==========================================
// NOTIFICATIONS
// ==========================================

notificationBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    notificationDropdown.classList.toggle("show");

});

document.addEventListener("click", (e) => {

    if (
        !notificationDropdown.contains(e.target) &&
        !notificationBtn.contains(e.target)
    ) {

        notificationDropdown.classList.remove("show");

    }

});
// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    showDashboard();

    // ======================================
    // ADMIN PANEL
    // ======================================

    if (user.email === "danielidoghe@gmail.com") {

        adminPanel.style.display = "flex";

    } else {

        adminPanel.style.display = "none";

    }

    // ======================================
    // USER NAME
    // ======================================

    let displayName = "";

    if (user.displayName && user.displayName.trim() !== "") {

        displayName = user.displayName;

    } else {

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {

            displayName = userDoc.data().name || "User";

        } else {

            displayName = "User";

        }

    }

    // First name only

    const firstName = displayName.split(" ")[0];

    userName.textContent = firstName;

    profileInitial.textContent = firstName.charAt(0).toUpperCase();

    // ======================================
    // LOAD USER DATA
    // ======================================

    loadWallet(user.uid);

    loadPurchases(user.uid);

    loadInventory();

    loadNotifications(user.uid);

});
// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount){

    return "₦" + Number(amount || 0).toLocaleString("en-NG");

}
// ==========================================
// WALLET
// ==========================================

async function loadWallet(uid){

    const userRef = doc(db,"users",uid);

    const snap = await getDoc(userRef);

    if(!snap.exists()) return;

    const data = snap.data();

    const balance = data.walletBalance || 0;

    walletBalance.textContent = formatMoney(balance);

    topWallet.textContent = formatMoney(balance);

}
// ==========================================
// PURCHASES
// ==========================================

async function loadPurchases(uid){

    const q = query(

        collection(db,"orders"),

        where("uid","==",uid)

    );

    onSnapshot(q,(snapshot)=>{

        if(snapshot.empty){

            purchaseCount.textContent = "No purchases yet";

        }else{

            purchaseCount.textContent = snapshot.size;

        }

    });

}
// ==========================================
// INVENTORY
// ==========================================

async function loadInventory(){

    const logsRef = collection(db,"logs");

    const toolsRef = collection(db,"tools");

    onSnapshot(logsRef,(logs)=>{

        onSnapshot(toolsRef,(tools)=>{

            inventoryCount.textContent =

                logs.size + tools.size;

            inventoryBreakdown.textContent =

                `${logs.size} logs • ${tools.size} tools`;

        });

    });

}
// ==========================================
// NOTIFICATIONS
// ==========================================

function loadNotifications(uid){

    const q = query(
        collection(db, "notifications"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(20)
    );

    onSnapshot(q, (snapshot) => {

        notificationList.innerHTML = "";

        notificationBadge.textContent = snapshot.size;

        if(snapshot.empty){

            notificationList.innerHTML = `
                <div class="notification-empty">
                    <p>No notifications yet.</p>
                </div>
            `;

            notificationBadge.textContent = "0";

            return;
        }

        let unread = 0;

        snapshot.forEach((docSnap)=>{

            const data = docSnap.data();

            if(!data.read){

                unread++;

            }

            notificationList.innerHTML += `

            <div class="notification-item">

                <div class="notification-icon">

                    ${notificationIcon(data.type)}

                </div>

                <div class="notification-content">

                    <h4>${data.title}</h4>

                    <p>${data.message}</p>

                    <div class="notification-time">

                        ${timeAgo(data.createdAt)}

                    </div>

                </div>

            </div>

            `;

        });

        notificationBadge.textContent = unread;

    });

}
// ==========================================
// NOTIFICATION ICONS
// ==========================================

function notificationIcon(type){

    switch(type){

        case "wallet":
            return '<i class="fa-solid fa-wallet"></i>';

        case "order":
            return '<i class="fa-solid fa-bag-shopping"></i>';

        case "login":
            return '<i class="fa-solid fa-right-to-bracket"></i>';

        case "support":
            return '<i class="fa-solid fa-headset"></i>';

        default:
            return '<i class="fa-solid fa-bell"></i>';

    }

} 
// ==========================================
// TIME AGO
// ==========================================

function timeAgo(timestamp){

    if(!timestamp) return "Just now";

    const now = Date.now();

    const date = timestamp.toDate().getTime();

    const seconds = Math.floor((now - date) / 1000);

    if(seconds < 60){

        return "Just now";

    }

    if(seconds < 3600){

        return Math.floor(seconds / 60) + "m ago";

    }

    if(seconds < 86400){

        return Math.floor(seconds / 3600) + "h ago";

    }

    return Math.floor(seconds / 86400) + "d ago";

}
// ==========================================
// MARK ALL READ
// ==========================================

markAllRead.addEventListener("click", async () => {

    const user = auth.currentUser;

    if(!user) return;

    const q = query(
        collection(db, "notifications"),
        where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    for(const document of snapshot.docs){

        await updateDoc(document.ref, {

            read:true

        });

    }

});
