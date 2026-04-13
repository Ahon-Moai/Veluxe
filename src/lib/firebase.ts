import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  enableIndexedDbPersistence, 
  doc, 
  getDocFromServer,
  connectFirestoreEmulator
} from 'firebase/firestore';

// Default config from the JSON file
// @ts-ignore
import firebaseConfigFromJson from '../../firebase-applet-config.json';

// Use the JSON config directly to avoid any environment variable confusion
const firebaseConfig = {
  apiKey: firebaseConfigFromJson.apiKey,
  authDomain: firebaseConfigFromJson.authDomain,
  projectId: firebaseConfigFromJson.projectId,
  storageBucket: firebaseConfigFromJson.storageBucket,
  messagingSenderId: firebaseConfigFromJson.messagingSenderId,
  appId: firebaseConfigFromJson.appId,
  firestoreDatabaseId: firebaseConfigFromJson.firestoreDatabaseId,
};

console.log('Firebase Initializing with Project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings to improve connectivity in restricted environments
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

export const auth = getAuth(app);

// Enable persistence with a more graceful error handling
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore Persistence: Multiple tabs open, persistence enabled in one tab only.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore Persistence: Browser does not support persistence.');
    } else {
      console.error('Firestore Persistence Error:', err);
    }
  });
}

