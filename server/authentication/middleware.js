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
import jwt from "jsonwebtoken";

const db = getFirestore(firebase);

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized1" });
    }

    try {
        const cookie = jwt.verify(token, "your-secret-key");
        const decodedToken = await admin.auth().verifyIdToken(cookie.idToken);
        req.user = decodedToken; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const isAdmin = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "your-secret-key");
        
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // get the document of this user id
        const userDoc = await getDoc(doc(db, 'user', decodedToken.uid))
        const userData = userDoc.data();

        if (userData.role != ROLES.ADMIN) {
            return res.status(401).send("Permission Denied")
        }
        next(); // Proceed to the next middleware or route handler

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

};

export { authenticate, isAdmin }