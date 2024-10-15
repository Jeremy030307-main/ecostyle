// Import the Firebase Admin SDK
import admin from 'firebase-admin';
import { ROLES } from "./userRole.js";
import firebase from '../firebase.js';
import {
    getDoc,
    doc,
    getFirestore,
} from 'firebase/firestore';

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'ecostyle-f6ae5', // Manually specify your project ID
});

const db = getFirestore(firebase);

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send(error.message);
    }
};

const isAdmin = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // get the document of this user id
        const userDoc = await getDoc(doc(db, 'user', decodedToken.uid))
        const userData = userDoc.data();

        if (userData.role != ROLES.ADMIN) {
            return res.status(401).send("Permission Denied")
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send(error.message);
    }

};

export { authenticate, isAdmin }