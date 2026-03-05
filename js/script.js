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

let currentUser = null;

signInAnonymously(auth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                document.getElementById('userBalance').innerText = data.balance.toFixed(2);
                startBonusCountdown(data.lastBonusTime || 0);
            } else {
                set(userRef, { balance: 0.00, lastBonusTime: 0 });
            }
            document.getElementById('loader').style.display = 'none';
        });
    }
});

function startBonusCountdown(lastTime) {
    const btn = document.getElementById('bonusBtn');
    const cooldown = 15 * 60 * 1000;

    const timerFunc = () => {
        const now = Date.now();
        const remaining = cooldown - (now - lastTime);

        if (remaining > 0) {
            btn.disabled = true;
            const m = Math.floor(remaining / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            btn.innerText = `Wait ${m}:${s < 10 ? '0' : ''}${s}s`;
            setTimeout(timerFunc, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = "Daily Bonus (Tk. 5.00)";
        }
    };
    timerFunc();
}

document.getElementById('bonusBtn').onclick = () => {
    window.open(adLink, '_blank');
    const userRef = ref(db, 'users/' + currentUser.uid);
    get(userRef).then(snap => {
        update(userRef, { balance: snap.val().balance + 5.00, lastBonusTime: Date.now() });
    });
};

window.startTask = function() {
    window.open(adLink, '_blank');
    window.location.href = "income.html";
};
