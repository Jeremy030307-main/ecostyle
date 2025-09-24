import admin from 'firebase-admin';
import fs from 'fs';

if (!admin.apps.length) {
  let credential;

  // Check if we're on Vercel (production)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Use environment variable (JSON string)
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      credential = admin.credential.cert(serviceAccount);
    } else {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }
  } else {
    // Local development - use the JSON file
    if (fs.existsSync('./serviceAccountKey.json')) {
      const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else {
      throw new Error('serviceAccountKey.json file not found for local development');
    }
  }

  admin.initializeApp({
    credential: credential,
    projectId: 'ecostyle-f6ae5',
  });
}

const db = admin.firestore();
export { db };