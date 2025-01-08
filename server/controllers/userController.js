import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { COLLECTIONS, message } from './utility.js';

// set user cookie
export const setCookie = async (req, res) => {
  const { token } = req.body;  // Get token sent from frontend

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Set the token as a cookie (HTTP-Only, Secure, SameSite)
    res.cookie('authToken', token, {
      httpOnly: true,  // Prevents access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use cookies only over HTTPS in production
      sameSite: 'Strict',  // Protects against CSRF
      maxAge: 24 * 60 * 60 * 1000,  // 1 day expiration
    });

    res.status(200).json({ message: 'Authenticated', user: decodedToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// get the display name of a user
export const getUser = async (req, res, next) => {
  try {
    const uid = req.user;

    // Fetch the user information from Firebase Authentication
    const userRecord = await admin.auth().getUser(uid); // `id` is the Firebase UID
    
    // If user exists, return the user details
    const userData = {
      id: userRecord.uid, // UID (the Firebase Authentication user ID)
      displayName: userRecord.displayName, // Display Name
      email: userRecord.email,
      phone: userRecord.phoneNumber || null
    };
    
    res.status(200).send(userData); // Send the user data as the response
  } catch (error) {
    // If an error occurs (e.g., user not found), handle it
    res.status(400).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  const uid = req.user;
  const { name, phone } = req.body;

  try {
    // Construct update object dynamically
    const updateData = {};
    if (phone){
      updateData.phoneNumber = phone;
    } else {
      updateData.phoneNumber = null
    }
    if (name) updateData.displayName = name;

    // Update the user only if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const userRecord = await admin.auth().updateUser(uid, updateData);
      res.status(200).send({ message: "User updated successfully", user: userRecord });
    } else {
      res.status(400).send({ message: "No valid fields to update" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// create new user by its id
export const newUser = async (req, res, next) => {
  console.log("Try to create user")

  try {
    // Get the user id from the authenticated user
    const id = req.user;

    // Create a new document under the 'users' collection with no fields
    const userRef = db.collection(COLLECTIONS.USER).doc(id);
    console.log("Creting ...")
    await userRef.set({}); // Set an empty document
    console.log("User Doc Created. ")

    res.status(200).send(message("User Sign Up successful, empty document created with subcollections"));
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
}

// ----------------------- Admin Fuction -------------------------------
// Function to list all users
export const listAllUsers = async (req, res) => {
  try {
    let allUsers = [];
    let nextPageToken;

    // Fetch users in batches
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken); // 1000 is the max number of users per batch
      allUsers = allUsers.concat(result.users); // Concatenate the users to the array
      nextPageToken = result.pageToken; // Get the token for the next page of users
    } while (nextPageToken); // Continue fetching while there's more data (nextPageToken is not null)

    // Send response with all users
    res.status(200).json({
      users: allUsers.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
};

// create admin level user
export const setAdmin = async (req, res, next) => {
  const uid = req.params.id;

  try {
    // Start a Firestore transaction
    await admin.firestore().runTransaction(async (transaction) => {
      const userRef = admin.firestore().collection('users').doc(uid);

      // Get the user's Firestore document
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error(`User document with ID ${uid} does not exist`);
      }

      // Update the Firestore document role
      transaction.update(userRef, { role: 'admin' });

      // Set the custom claim 'role' to 'admin' for the user
      await admin.auth().setCustomUserClaims(uid, { admin: true });
    });

    console.log(`Custom claim and Firestore role set for user ${uid}`);
    res.status(200).json({ message: `Custom claim 'admin' and Firestore role set for user ${uid}` });
  } catch (error) {
    console.error('Error setting custom claim or updating Firestore role:', error);
    res.status(500).json({ error: 'Failed to set custom claim or update Firestore role' });
  }
};
