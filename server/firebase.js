import admin from 'firebase-admin';

if (!admin.apps.length) {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Vercel deployment - use environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Local development - use file
    const serviceAccount = JSON.parse(
      require('fs').readFileSync('./serviceAccountKey.json', 'utf8')
    );
    credential = admin.credential.cert(serviceAccount);
  }

  admin.initializeApp({
    credential: credential,
    projectId: 'ecostyle-f6ae5',
  });
}

const db = admin.firestore();
export { db };