import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc
} from "./firebase.js";

const ADMIN_EMAIL = "danielidoghe@gmail.com";

const userName = document.getElementById("userName");
const profileImage = document.getElementById("profileImage");
const walletBalance = document.getElementById("walletBalance");
const headerWallet = document.getElementById("headerWallet");
const adminMenu = document.getElementById("adminMenu");

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    if(user.email===ADMIN_EMAIL){

        adminMenu.style.display="flex";

    }

    const userRef=doc(db,"users",user.uid);

    const snap=await getDoc(userRef);

    if(!snap.exists()) return;

    const data=snap.data();

    userName.textContent=data.firstName||"User";

    const balance=data.wallet||0;

    walletBalance.textContent=
    "₦"+Number(balance).toLocaleString();

    headerWallet.textContent=
    "₦"+Number(balance).toLocaleString();

    if(data.photoURL){

        profileImage.src=data.photoURL;

    }

});
