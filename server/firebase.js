// firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './ecostyle-f6ae5-firebase-adminsdk-usabu-0b1c2c17bb.json' assert { type: 'json' };
import { assert } from 'joi';

// Initialize Firebase Admin app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Optionally, add projectId if needed
    // projectId: 'ecostyle-f6ae5',
  });
}

const db = admin.firestore();

// Export the db (Firestore) and any other services you may need
export { db };


