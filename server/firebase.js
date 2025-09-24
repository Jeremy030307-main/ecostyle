// firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

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


