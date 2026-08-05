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
query,
orderBy,
onSnapshot,
serverTimestamp
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
ELEMENTS
=========================*/

const menuBtn = document.getElementById("menuBtn");

const profileLetter = document.getElementById("profileLetter");

const notificationCount = document.getElementById("notificationCount");

const ticketsContainer = document.getElementById("ticketsContainer");

const newTicketBtn = document.getElementById("newTicketBtn");

const ticketModal = document.getElementById("ticketModal");

const ticketSubject = document.getElementById("ticketSubject");

const ticketCategory = document.getElementById("ticketCategory");

const ticketMessage = document.getElementById("ticketMessage");

const cancelTicket = document.getElementById("cancelTicket");

const submitTicket = document.getElementById("submitTicket");

/*=========================
CURRENT USER
=========================*/

let currentUser = null;

/*=========================
AUTH
=========================*/

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="signin.html";

return;

}

currentUser=user;

const userRef=doc(db,"users",user.uid);

const userSnap=await getDoc(userRef);

if(userSnap.exists()){

const data=userSnap.data();

profileLetter.textContent=
(data.name||"D").charAt(0).toUpperCase();

notificationCount.textContent=
data.notifications||0;

}

loadTickets(user.uid);

});

/*=========================
MENU
=========================*/

menuBtn.onclick=()=>{

location.href="dashboard.html";

};
