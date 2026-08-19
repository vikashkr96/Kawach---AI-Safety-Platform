import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Optional Firebase configuration loaded from Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const hasFirebase = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export let app;
export let auth;
export let db;

if (hasFirebase) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization notice: Running in local reactive state mode.', err);
  }
} else {
  console.log('🛡️ Kavach running with Local Reactive Firestore Engine (Zero-Config local setup ready)');
}

/**
 * Local Event-Driven PubSub Bus for real-time local sync across components & tabs
 */
class LocalEventBus {
  constructor() {
    this.listeners = {};
    window.addEventListener('storage', (e) => {
      if (e.key && this.listeners[e.key]) {
        try {
          const val = JSON.parse(e.newValue);
          this.listeners[e.key].forEach(cb => cb(val));
        } catch {
          // ignore
        }
      }
    });
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  emit(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
    if (this.listeners[key]) {
      this.listeners[key].forEach(cb => cb(data));
    }
  }

  get(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

export const localStore = new LocalEventBus();
