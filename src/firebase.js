import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1crrHoqHOawCMaSxH0HUO8FiqzX91ExQ",
  authDomain: "renovision-68f37.firebaseapp.com",
  projectId: "renovision-68f37",
  storageBucket: "renovision-68f37.firebasestorage.app",
  messagingSenderId: "463989723689",
  appId: "1:463989723689:web:f91ea4766e6cfebeebc238"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider =
  new GoogleAuthProvider();

// ─────────────────────────────────────────
// Google Sign In
// ─────────────────────────────────────────
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(
      auth, googleProvider
    );
    const user = result.user;
    return {
      success: true,
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ─────────────────────────────────────────
// Sign Out
// ─────────────────────────────────────────
export const signOutGoogle = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};