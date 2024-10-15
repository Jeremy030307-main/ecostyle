import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword ,
    signOut,
} from "firebase/auth";

import firebase from '../firebase.js';
import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore';
import { ROLES } from "./userRole.js";

const db = getFirestore(firebase);
const auth = getAuth();

// user sign up with email and password (only for customer creation)
export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Merge req.body data with an additional field (e.g., 'role': 'user')
        const userData = {
          ...req.body, 
          role: ROLES.CUSTOMER,
        };
        
        // Wait for the user creation to complete
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Extract user info from the created userCredential
        const user = userCredential.user;

        await setDoc(doc(db, 'user',user.uid), userData);
        
        const idToken = await user.getIdToken(); // Or verify the token

        // Send a success response after the user is created
        res.status(200).json({
        idToken: idToken,
        uid: user.uid
        });

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};

// sign in
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Wait for the user sign in to complete
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Extract user info from the created userCredential
        const user = userCredential.user;
        
        const idToken = await user.getIdToken(); // Or verify the token

        // Send a success response after the user is created
        res.status(200).json({
          idToken: idToken,
          uid: user.uid
        });

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};

// sign out
export const userSignOut = async (req, res, next) => {
    try {
        // Wait for the user sign out to complete
        await signOut(auth);

        // Send a success response after the user is created
        res.status(200).send("Sign Out Successfully")

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};

// create admin level user
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    // Wait for the user creation to complete
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Extract user info from the created userCredential
    const user = userCredential.user;

    await db.collection('user').doc(user.uid).set(req.body)
    
    const idToken = await user.getIdToken(); // Or verify the token

    // Send a success response after the user is created
    res.status(200).json({
    idToken: idToken,
    uid: user.uid
    });

  } catch (error) {
    // Send error response if there is any
    res.status(400).send(error.message);
  }
}
