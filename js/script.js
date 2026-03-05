import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCocTCNbmDj8b5fOrh5g7W_0YghJ8n9niE",
  authDomain: "earnpoint-76792.firebaseapp.com",
  databaseURL: "https://earnpoint-76792-default-rtdb.firebaseio.com",
  projectId: "earnpoint-76792",
  storageBucket: "earnpoint-76792.firebasestorage.app",
  messagingSenderId: "88961998597",
  appId: "1:88961998597:web:1cf6237d002b5eedb9a16c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const adLink = "https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009";

// লগইন স্ট্যাটাস চেক
onAuthStateChanged(auth, (user) => {
    if (user) {
        handleUserSession(user);
    } else {
        signInAnonymously(auth).catch(err => {
            console.error("Auth Error:", err);
            document.getElementById('loader').style.display = 'none';
        });
    }
});

function handleUserSession(user) {
    const userRef = ref(db, 'users/' + user.uid);
    const shortName = "User_" + user.uid.substring(user.uid.length - 4);
    document.getElementById('userNameHeader').innerText = shortName;

    // নেট স্লো থাকলে ৫ সেকেন্ড পর অটো লোডার বন্ধ হবে
    const forceHideLoader = setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 5000);

    onValue(userRef, (snapshot) => {
        clearTimeout(forceHideLoader);
        const data = snapshot.val();
        if (data) {
            document.getElementById('userBalance').innerText = data.balance.toFixed(2);
            startBonusTimer(data.lastBonusTime || 0);
        } else {
            // নতুন ইউজার হলে ডেটাবেসে এন্ট্রি তৈরি
            set(userRef, { balance: 0.00, lastBonusTime: 0, name: shortName });
        }
        document.getElementById('loader').style.display = 'none';
    });
}

function startBonusTimer(lastTime) {
    const btn = document.getElementById('bonusBtn');
    const cooldown = 15 * 60 * 1000; // ১৫ মিনিট

    const tick = () => {
        const diff = Date.now() - lastTime;
        if (diff < cooldown) {
            btn.disabled = true;
            const remaining = cooldown - diff;
            const m = Math.floor(remaining / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            btn.innerText = `Wait ${m}:${s < 10 ? '0' : ''}${s}s`;
            setTimeout(tick, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = "Daily Bonus (Tk. 5.00)";
        }
    };
    tick();
}

// বোনাস বাটন ক্লিক
document.getElementById('bonusBtn').onclick = () => {
    window.open(adLink, '_blank');
    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    get(userRef).then(snap => {
        const currentBalance = snap.val().balance || 0;
        update(userRef, { 
            balance: currentBalance + 5.00, 
            lastBonusTime: Date.now() 
        });
        alert("Success! 5.00 Tk added.");
    });
};

// টাস্ক ক্লিক
window.startTask = function(taskName) {
    window.open(adLink, '_blank');
    window.location.href = "income.html";
};
