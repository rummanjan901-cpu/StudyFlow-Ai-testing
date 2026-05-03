import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// --- Your StudyFlow Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAECOmsUEXlgjS-9zGfV7RgD0P33PE84XY",
  authDomain: "studyflow-2737d.firebaseapp.com",
  projectId: "studyflow-2737d",
  storageBucket: "studyflow-2737d.firebasestorage.app",
  messagingSenderId: "802302343998",
  appId: "1:802302343998:web:35865a347483e2c69d0a6f",
  measurementId: "G-J0YG2LVG5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Register a new user
 */
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

/**
 * Login existing user
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

/**
 * Logout
 */
export const logoutUser = () => signOut(auth);

/**
 * Listen for Auth State Changes
 */
export const observeAuth = (callback) => {
    onAuthStateChanged(auth, callback);
};
