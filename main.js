// ================= FIREBASE IMPORTS =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
   apiKey: "AIzaSyBbv58b5sR5WOP024Dg7V0hWfkDm9c6kVA",

    authDomain: "myserv-9812e.firebaseapp.com",

    projectId: "myserv-9812e",

    storageBucket: "myserv-9812e.firebasestorage.app",

    messagingSenderId: "604861069257",

    appId: "1:604861069257:web:319e08deb6c488edcd1a18",

    measurementId: "G-WQLK5DFEWM"

};

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= ELEMENTS =================
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userNameBox = document.getElementById("userName");
const uploadBtn = document.getElementById("uploadBtn");

// ================= GLOBAL USER =================
let currentUser = null;

// ================= AUTH STATE =================
onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    // 🔐 LOGGED IN
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // 👋 Welcome text
      if (userNameBox) {
        userNameBox.innerText = `Welcome, ${data.name} 👋`;
      }

      // 🛡 Admin check
      if (data.role === "admin") {
        uploadBtn.style.display = "inline-block";
      } else {
        uploadBtn.style.display = "none";
      }
    }
  } else {
    // ❌ LOGGED OUT
    currentUser = null;
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (uploadBtn) uploadBtn.style.display = "none";
    if (userNameBox) userNameBox.innerText = "";
  }
});

// ================= LOGOUT =================
window.logout = async function () {
  await signOut(auth);
  // window.location.href = "logsign.html";
  openModal();
};

// ================= PDF PROTECTION =================
window.openPDF = function (pdfName) {
  if (!currentUser) {
    alert("Login required to download PDF");
    // window.location.href = "logsign.html";
    openModal();
    return;
  }

  window.open(`pdfs/${pdfName}`, "_blank");
};

// ================= ADMIN ACTION =================
if (uploadBtn) {
  uploadBtn.onclick = () => {
    alert("Admin Upload Panel - Coming Soon!");
  };
}

const modal = document.getElementById("authModal");
const signupBox = document.getElementById("signupBox");
const loginBox = document.getElementById("loginBox");

window.openModal = function () {
  modal.style.display = "flex";
  signupBox.style.display = "block";
  loginBox.style.display = "none";
};

window.closeModal = function () {
  modal.style.display = "none";
};

window.showLogin = function () {
  signupBox.style.display = "none";
  loginBox.style.display = "block";
};

window.showSignup = function () {
  loginBox.style.display = "none";
  signupBox.style.display = "block";
};

// ================= SIGNUP =================
window.signup = async function () {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("All fields required");
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      name: name,
      email: email,
      role: "user",
      createdAt: Date.now(),
    });

    alert("Signup successful 🎉");
    closeModal();
  } catch (err) {
    alert(err.message);
  }
};
// ================= LOGIN FUNCTION =================

window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("fill both email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful 🎉");
    closeModal(); // agar modal use ho raha hai
  } catch (error) {
    alert(error.message);
  }
};
