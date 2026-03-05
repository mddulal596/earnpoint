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

onAuthStateChanged(auth, (user) => {
    if (user) {
        // ইউজারের নাম হিসেবে আইডি-র শেষ ৫ অক্ষর দেখানো হচ্ছে
        const shortName = "User_" + user.uid.substring(user.uid.length - 5);
        document.getElementById('userName').innerText = shortName;
        
        const userRef = ref(db, 'users/' + user.uid);
        
        // ৫ সেকেন্ড পর অটো লোডার বন্ধ হবে যদি নেট স্লো থাকে
        const forceCloseLoader = setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 5000);

        onValue(userRef, (snapshot) => {
            clearTimeout(forceCloseLoader);
            const data = snapshot.val();
            if (data) {
                document.getElementById('userBalance').innerText = data.balance.toFixed(2);
                handleBonusTimer(data.lastBonusTime || 0);
            } else {
                set(userRef, { balance: 0.00, lastBonusTime: 0, name: shortName });
            }
            document.getElementById('loader').style.display = 'none';
        });
    } else {
        signInAnonymously(auth);
    }
});

function handleBonusTimer(lastTime) {
    const btn = document.getElementById('bonusBtn');
    const cooldown = 15 * 60 * 1000; 

    const updateBtn = () => {
        const now = Date.now();
        const diff = now - lastTime;
        if (diff < cooldown) {
            btn.disabled = true;
            const rem = cooldown - diff;
            const m = Math.floor(rem / 60000);
            const s = Math.floor((rem % 60000) / 1000);
            btn.innerText = `Wait ${m}:${s < 10 ? '0' : ''}${s}s`;
            setTimeout(updateBtn, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = "Daily Bonus (Tk. 5.00)";
        }
    };
    updateBtn();
}

document.getElementById('bonusBtn').onclick = () => {
    window.open(adLink, '_blank');
    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    get(userRef).then(snap => {
        update(userRef, { balance: snap.val().balance + 5.00, lastBonusTime: Date.now() });
    });
};

window.startTask = function() {
    window.open(adLink, '_blank');
    window.location.href = "income.html";
};
