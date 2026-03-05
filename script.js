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

// Login Anonymously
signInAnonymously(auth).catch(error => console.error(error));

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        setupAppData();
    }
});

function setupAppData() {
    const userRef = ref(db, 'users/' + currentUser.uid);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('userBalance').innerText = data.balance.toFixed(2);
            checkBonusTimer(data.lastBonusTime);
        } else {
            set(userRef, { balance: 0.00, lastBonusTime: 0 });
        }
        document.getElementById('loader').style.display = 'none';
    });
}

// 15 Minute Bonus Timer Logic
function checkBonusTimer(lastTime) {
    const bonusBtn = document.getElementById('bonusBtn');
    const waitTime = 15 * 60 * 1000; // 15 minutes in ms
    
    const updateTimer = () => {
        const now = Date.now();
        const diff = now - lastTime;

        if (diff < waitTime) {
            bonusBtn.disabled = true;
            const remaining = waitTime - diff;
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            bonusBtn.innerText = `Wait ${mins}:${secs < 10 ? '0' : ''}${secs}s`;
            setTimeout(updateTimer, 1000);
        } else {
            bonusBtn.disabled = false;
            bonusBtn.innerText = "Daily Bonus (Tk. 5.00)";
        }
    };
    updateTimer();
}

document.getElementById('bonusBtn').addEventListener('click', () => {
    window.open(adLink, '_blank');
    const userRef = ref(db, 'users/' + currentUser.uid);
    get(userRef).then(snapshot => {
        const data = snapshot.val();
        update(userRef, {
            balance: data.balance + 5.00,
            lastBonusTime: Date.now()
        });
    });
});

window.startTask = function(taskName) {
    window.open(adLink, '_blank');
    window.location.href = "income.html";
};
