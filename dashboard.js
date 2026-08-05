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
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    writeBatch,
    signOut
} from "./firebase.js";

/*==================================
NOTIFICATIONS
==================================*/

const notificationList =
document.getElementById("notificationList");

const notificationCount =
document.getElementById("notificationCount");

const markAllRead =
document.getElementById("markAllRead");

const notificationBtn =
document.getElementById("notificationBtn");

const notificationDropdown =
document.getElementById("notificationDropdown");

let currentUser = null;

onAuthStateChanged(auth,(user)=>{

    if(!user) return;

    currentUser = user;

    const q = query(
        collection(db,"notifications"),
        where("uid","==",user.uid),
        orderBy("createdAt","desc")
    );

    onSnapshot(q,(snapshot)=>{

        notificationList.innerHTML="";

        let unread = 0;

        snapshot.forEach((docSnap)=>{

            const data = docSnap.data();

            if(!data.read) unread++;

            notificationList.innerHTML += `

            <div class="notification-item">

                <div class="notification-icon">

                    <i class="fa-solid fa-bell"></i>

                </div>

                <div class="notification-content">

                    <h4>${data.title}</h4>

                    <p>${data.message}</p>

                    <div class="notification-time">

                        ${new Date(data.createdAt.seconds*1000).toLocaleString()}

                    </div>

                </div>

            </div>

            `;

        });

        notificationCount.textContent = unread;

    });

});

/*==================================
MARK ALL READ
==================================*/

markAllRead.addEventListener("click",async()=>{

    if(!currentUser) return;

    const q = query(

        collection(db,"notifications"),

        where("uid","==",currentUser.uid)

    );

    onSnapshot(q,async(snapshot)=>{

        const batch = writeBatch(db);

        snapshot.forEach((docSnap)=>{

            batch.update(docSnap.ref,{
                read:true
            });

        });

        await batch.commit();

    });

});

/*==================================
NOTIFICATION DROPDOWN
==================================*/

notificationBtn.onclick=()=>{

    notificationDropdown.classList.toggle("show");

};

document.addEventListener("click",(e)=>{

    if(

        !notificationBtn.contains(e.target)

        &&

        !notificationDropdown.contains(e.target)

    ){

        notificationDropdown.classList.remove("show");

    }

});
/*==================================
RECENT ORDERS
==================================*/

const ordersContainer =
document.getElementById("ordersContainer");

onAuthStateChanged(auth,(user)=>{

if(!user) return;

const q=query(

collection(db,"orders"),

where("uid","==",user.uid),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

ordersContainer.innerHTML="";

if(snapshot.empty){

ordersContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<p>No recent orders.</p>

</div>

`;

return;

}

snapshot.forEach((doc)=>{

const order=doc.data();

ordersContainer.innerHTML+=`

<div class="order-row">

<div>

<h4>${order.productName}</h4>

<p>${order.status}</p>

</div>

<strong>

₦${Number(order.amount).toLocaleString()}

</strong>

</div>

`;

});

});

});
/*==================================
PURCHASE COUNT
==================================*/

const purchaseCount =
document.getElementById("purchaseCount");

onAuthStateChanged(auth,(user)=>{

if(!user) return;

const q=query(

collection(db,"orders"),

where("uid","==",user.uid)

);

onSnapshot(q,(snapshot)=>{

purchaseCount.textContent=snapshot.size;

});

});
/*==================================
LOGOUT
==================================*/

const logoutButton =
document.querySelector(".logout");

logoutButton.onclick=async()=>{

await signOut(auth);

location.href="login.html";

};
/*=========================================
LIVE INVENTORY
=========================================*/

const inventoryCount =
document.getElementById("inventoryCount");

onAuthStateChanged(auth,(user)=>{

if(!user) return;

const inventoryQuery=query(

collection(db,"inventory"),

where("uid","==",user.uid)

);

onSnapshot(inventoryQuery,(snapshot)=>{

inventoryCount.textContent=snapshot.size;

});

});

/*=========================================
LIVE TRANSACTIONS
=========================================*/

const transactionContainer =
document.getElementById("transactionContainer");

onAuthStateChanged(auth,(user)=>{

if(!user) return;

const transactionQuery=query(

collection(db,"transactions"),

where("uid","==",user.uid),

orderBy("createdAt","desc")

);

onSnapshot(transactionQuery,(snapshot)=>{

transactionContainer.innerHTML="";

if(snapshot.empty){

transactionContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-credit-card"></i>

<p>No transactions available.</p>

</div>

`;

return;

}

snapshot.forEach((doc)=>{

const data=doc.data();

transactionContainer.innerHTML+=`

<div class="transaction-row">

<div>

<h4>${data.title}</h4>

<p>${new Date(data.createdAt.seconds*1000).toLocaleString()}</p>

</div>

<strong>

₦${Number(data.amount).toLocaleString()}

</strong>

</div>

`;

});

});

});

/*=========================================
SIDEBAR
=========================================*/

const menuBtn=
document.getElementById("menuBtn");

const sidebar=
document.getElementById("sidebar");

const overlay=
document.getElementById("overlay");

const closeSidebar=
document.getElementById("closeSidebar");

menuBtn.onclick=()=>{

sidebar.classList.add("open");

overlay.classList.add("show");

}

closeSidebar.onclick=()=>{

sidebar.classList.remove("open");

overlay.classList.remove("show");

}

overlay.onclick=()=>{

sidebar.classList.remove("open");

overlay.classList.remove("show");

}

/*=========================================
LOADING SCREEN
=========================================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

document.getElementById("loading-screen").style.display="none";

},1000);

});

/*=========================================
DARK MODE
=========================================*/

const themeBtn=
document.getElementById("themeBtn");

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}

themeBtn.onclick=()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

}else{

localStorage.setItem("theme","light");

}

}

/*=========================================
QUICK ACTIONS
=========================================*/

document.getElementById("logsStore").onclick=()=>{

location.href="logs-store.html";

}

document.getElementById("toolsStore").onclick=()=>{

location.href="tools-store.html";

}

document.getElementById("numbersStore").onclick=()=>{

location.href="numbers.html";

}

document.getElementById("esimStore").onclick=()=>{

location.href="esim.html";

}

document.getElementById("boostingStore").onclick=()=>{

location.href="boosting.html";

}

document.getElementById("accountsStore").onclick=()=>{

location.href="accounts.html";

}
