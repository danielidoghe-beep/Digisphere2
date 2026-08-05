import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
collection,
query,
orderBy,
limit,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/*=========================
FIREBASE
=========================*/

const firebaseConfig = {

apiKey:"AIzaSyDnpsEIlXwPLSCJAGMS7feM2JMhmxzCCfs",

authDomain:"digisphere-66fdf.firebaseapp.com",

projectId:"digisphere-66fdf",

storageBucket:"digisphere-66fdf.firebasestorage.app",

messagingSenderId:"834194884246",

appId:"1:834194884246:web:72672ca253c3d7dd9d24b7",

measurementId:"G-19QS4036V7"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

/*=========================
ADMIN
=========================*/

const ADMIN_EMAIL = "danielidoghe@gmail.com";

/*=========================
ELEMENTS
=========================*/

const sidebar=document.getElementById("sidebar");

const sidebarOverlay=document.getElementById("sidebarOverlay");

const menuBtn=document.getElementById("menuBtn");

const closeSidebar=document.getElementById("closeSidebar");

const adminMenu=document.getElementById("adminMenu");

const userName=document.getElementById("userName");

const walletBalance=document.getElementById("walletBalance");

const headerWallet=document.getElementById("headerWallet");

const profileAvatar=document.getElementById("profileAvatar");

const ordersCount=document.getElementById("ordersCount");

const inventoryCount=document.getElementById("inventoryCount");

const notificationsCount=document.getElementById("notificationsCount");

const notificationBadge=document.getElementById("notificationBadge");

const recentOrders=document.getElementById("recentOrders");

const joinCommunity=document.getElementById("joinCommunity");

const logoutBtn=document.getElementById("logoutBtn");
/*=========================
AUTH
=========================*/

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="signin.html";

return;

}

const snap=await getDoc(

doc(db,"users",user.uid)

);

if(snap.exists()){

const data=snap.data();

userName.textContent=data.name||"User";

profileAvatar.textContent=

(data.name||"D")

.charAt(0)

.toUpperCase();

const wallet=Number(data.wallet||0);

walletBalance.textContent=

"₦"+wallet.toLocaleString();

headerWallet.textContent=

"₦"+wallet.toLocaleString();

}

if(user.email===ADMIN_EMAIL){

adminMenu.style.display="flex";

}else{

adminMenu.style.display="none";

}

loadOrders(user.uid);

loadInventory(user.uid);

loadNotifications(user.uid);

});
/*=========================
SIDEBAR
=========================*/

menuBtn.onclick=()=>{

sidebar.classList.add("show");

sidebarOverlay.classList.add("show");

};

closeSidebar.onclick=closeSidebarMenu;

sidebarOverlay.onclick=closeSidebarMenu;

function closeSidebarMenu(){

sidebar.classList.remove("show");

sidebarOverlay.classList.remove("show");

}
joinCommunity.onclick=()=>{

window.open(

"https://chat.whatsapp.com/BvzLHIbNl0a0SclNT58bKy",

"_blank"

);

};
document.getElementById("smsNumbers").onclick=()=>{

window.open(

"https://wa.me/2349117412352?text="+

encodeURIComponent(

"Hey DigiSphere, I want to buy SMS Numbers."

)

);

};

document.getElementById("smeBoost").onclick=()=>{

window.open(

"https://wa.me/2349117412352?text="+

encodeURIComponent(

"Hey DigiSphere, I want SME Boosting."

)

);

};

document.getElementById("esim").onclick=()=>{

window.open(

"https://wa.me/2349117412352?text="+

encodeURIComponent(

"Hey DigiSphere, I want to buy an E-SIM."

)

);

};

document.getElementById("community").onclick=()=>{

window.open(

"https://chat.whatsapp.com/BvzLHIbNl0a0SclNT58bKy",

"_blank"

);
};
logoutBtn.onclick=async()=>{

await signOut(auth);

location.href="signin.html";

};
