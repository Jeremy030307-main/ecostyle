// Import the Firebase Admin SDK
import admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'ecostyle-f6ae5', // Manually specify your project ID
});

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).send('Unauthorized 1');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send(error.message);
    }
};

export default authenticate