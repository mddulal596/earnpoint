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
        setupUser(user);
    } else {
        signInAnonymously(auth).catch(() => {
            document.getElementById('loader').style.display = 'none';
        });
    }
});

function setupUser(user) {
    const userRef = ref(db, 'users/' + user.uid);
    const shortID = user.uid.substring(0, 5); // ID-র প্রথম ৫ অক্ষর নামের মতো দেখাবে
    document.getElementById('headerUserName').innerText = "ID: " + shortID;

    // ৫ সেকেন্ডের ব্যাকআপ টাইমআউট (যদি নেট স্লো থাকে)
    const backupTimeout = setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 5000);

    onValue(userRef, (snapshot) => {
        clearTimeout(backupTimeout);
        const data = snapshot.val();
        if (data) {
            document.getElementById('userBalance').innerText = data.balance.toFixed(2);
            updateBonusTimer(data.lastBonusTime || 0);
        } else {
            // নতুন ইউজার হলে ডেটা তৈরি
            set(userRef, { balance: 0.00, lastBonusTime: 0, uid: user.uid });
        }
        document.getElementById('loader').style.display = 'none';
    });
}

function updateBonusTimer(lastTime) {
    const btn = document.getElementById('bonusBtn');
    const cooldown = 15 * 60 * 1000;
    const tick = () => {
        const remaining = cooldown - (Date.now() - lastTime);
        if (remaining > 0) {
            btn.disabled = true;
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

// বাটন ক্লিক ফাংশন
document.getElementById('bonusBtn').onclick = () => {
    window.open(adLink, '_blank');
    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    get(userRef).then(snap => {
        update(userRef, { balance: snap.val().balance + 5.00, lastBonusTime: Date.now() });
    });
};

window.startTask = () => {
    window.open(adLink, '_blank');
    window.location.href = "income.html";
};
