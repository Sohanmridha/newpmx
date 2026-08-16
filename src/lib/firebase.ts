import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust local offline cache persistence, falling back to standard getFirestore if blocked in sandboxed iframes
let dbInstance;
try {
  // @ts-ignore - The third parameter databaseId is valid but typescript definitions might not be updated
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("Firestore initializeFirestore with localCache failed (common in sandboxed iframes). Falling back to standard getFirestore:", e);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = dbInstance;

export const auth = getAuth(app);

// Enable persistence so the user stays logged in across refreshes
setPersistence(auth, browserLocalPersistence).catch((err) => console.error("Persistence error:", err));

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      alert("Please allow popups for this site to sign in with Google.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.warn("Sign-in popup was closed by the user before completion.");
      return null;
    }
    console.error("Login failed:", error.code, error.message);
    throw error;
  }
};

export const logout = () => signOut(auth);
