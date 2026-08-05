import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {

getAuth,

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {

getFirestore,

collection,

query,

orderBy,

onSnapshot,

doc,

getDoc

} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

/* Firebase */

const firebaseConfig = {

apiKey:"YOUR_API_KEY",

authDomain:"YOUR_AUTH_DOMAIN",

projectId:"YOUR_PROJECT_ID",

storageBucket:"YOUR_STORAGE_BUCKET",

messagingSenderId:"YOUR_SENDER_ID",

appId:"YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const toolsContainer = document.getElementById("toolsContainer");

const profileLetter = document.getElementById("profileLetter");

const menuBtn = document.getElementById("menuBtn");

menuBtn.onclick = () => {

location.href = "dashboard.html";

};

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="signin.html";

return;

}

const userDoc = await getDoc(

doc(db,"users",user.uid)

);

if(userDoc.exists()){

profileLetter.textContent=

(userDoc.data().name||"D")

.charAt(0)

.toUpperCase();

}

loadPurchasedTools(user.uid);

});

function loadPurchasedTools(uid){

const q=query(

collection(

db,

"users",

uid,

"purchasedTools"

),

orderBy(

"purchasedAt",

"desc"

)

);

onSnapshot(q,(snapshot)=>{

toolsContainer.innerHTML="";

if(snapshot.empty){

toolsContainer.innerHTML=`

<div class="empty-state">

<h2>No Purchased Tools</h2>

<p>

You haven't purchased any tools yet.

</p>

</div>

`;

return;

}

snapshot.forEach((docSnap)=>{

const tool=docSnap.data();

toolsContainer.innerHTML+=`

<div class="tool-card">

<img

src="${tool.image}"

class="tool-image">

<div class="tool-content">

<h2>

${tool.title}

</h2>

<p>

${tool.description}

</p>

<a

href="${tool.downloadUrl}"

target="_blank"

class="download-btn">

DOWNLOAD

</a>

</div>

</div>

`;

});

});

}
