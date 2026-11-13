import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const FIREBASE_STORAGE_KEY = 'sh_firebase_config_v1';

export function getClientFirebaseConfig(): FirebaseConfig {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(FIREBASE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB_sh_clothing_db_12639',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'sh-clothing-db-12639.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sh-clothing-db-12639',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sh-clothing-db-12639.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '949322287608',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:949322287608:web:shclothing12639',
  };
}

export function saveClientFirebaseConfig(config: FirebaseConfig) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('sh_firebase_config_updated'));
  }
}

const currentConfig = getClientFirebaseConfig();

export const isFirebaseConfigured = Boolean(
  currentConfig.projectId && currentConfig.projectId.length > 0
);

let appInstance: any = null;
if (isFirebaseConfigured) {
  try {
    appInstance = !getApps().length ? initializeApp(currentConfig) : getApp();
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

export const db = appInstance ? getFirestore(appInstance) : null;
export const auth = appInstance ? getAuth(appInstance) : null;
export const storage = appInstance ? getStorage(appInstance) : null;

/**
 * Returns an active Firestore database instance, initializing on demand if necessary
 */
export function getFirestoreDb() {
  if (db) return db;
  try {
    const config = getClientFirebaseConfig();
    const app = !getApps().length ? initializeApp(config) : getApp();
    return getFirestore(app);
  } catch (error) {
    console.warn('Firebase getFirestoreDb notice:', error);
    return null;
  }
}
