import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Default config from the JSON file
// @ts-ignore
import firebaseConfigFromJson from '../../firebase-applet-config.json';

// Allow environment variables to override (useful for Vercel/hosting)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigFromJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFromJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigFromJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigFromJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFromJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigFromJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigFromJson.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings to improve connectivity in restricted environments
export const db = initializeFirestore(app, {
  databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
  experimentalForceLongPolling: true, // Force long polling to bypass WebSocket issues
}, firebaseConfig.firestoreDatabaseId || '(default)');

export const auth = getAuth(app);

// Enable persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}

// Test connection
import { doc, getDocFromServer } from 'firebase/firestore';
async function testConnection() {
  try {
    // Try to get a non-existent doc just to check connection
    // We use a timeout to avoid hanging indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    clearTimeout(timeoutId);
    console.log('Firestore connection successful');
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn("Firestore connection timed out. This might be a temporary network issue.");
    } else if (error.message && error.message.includes('the client is offline')) {
      console.error("Firestore is offline. Please check your Firebase configuration or project status.");
    } else {
      // Ignore other errors like "permission denied" as they still indicate a connection
      console.log('Firestore connection test completed (may have expected permission error)');
    }
  }
}
testConnection();
