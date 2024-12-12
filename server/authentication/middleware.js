// Import the Firebase Admin SDK
import admin from 'firebase-admin';

import jwt from "jsonwebtoken";
import { db } from '../firebase.js';

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

    const token = authHeader.split(' ')[1]; // Split "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing in Authorization header' });
      }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};


const isAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

    const token = authHeader.split(' ')[1]; // Split "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing in Authorization header' });
      }

    try {
        const claims = await admin.auth().verifyIdToken(token);
        if (claims.admin !== true){
            return res.status(401).send("Permission Denied")
        } 
        req.user = claims;
        next()

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export { authenticate, isAdmin }