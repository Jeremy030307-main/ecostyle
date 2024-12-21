import admin from 'firebase-admin';
import { db } from "../firebase.js";

const userCollection = 'user'

// create new user by its id
export const newUser = async (req, res, next) => {
  try{
    const id = req.params.id;
    const userData = req.body;
    await db.collection(userCollection).doc(id).create(userData)
    res.status(200).send("User Sign Up")
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// update data of existing user
export const updateUser = async(req, res) => {
  try {
    const {id, ...userData} = req.body;
    await db.collection(userCollection).doc(id).set(userData)
    res.status(200).send("User Updated")
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// delete data of existing user
export const deleteUser = async(req, res) => {
  try {
    const id = req.params.id;
    await db.collection(userCollection).doc(id).delete()
    res.status(200).send("User Deleted")
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// get a user by its id
export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await db.collection('user').doc(id).get();
    
    if (data.exists) {
      const userData = data.data(); // Get the document's data
      userData.id = id; // Add the document ID to the data
      res.status(200).send(userData); // Send the data with the ID
    } else {
      res.status(404).send('product not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// create admin level user
export const setAdmin = async (req, res, next) => {
  try {
    const uid = req.params.id;

    // Set the custom claim 'role' to 'admin' for the user
    await admin.auth().setCustomUserClaims(uid, { admin: true })

    console.log(`Custom claim set for user ${uid}`);
    res.status(200).json({ message: `Custom claim 'admin' set for user ${uid}`});

  } catch (error) {
    console.error('Error setting custom claim:', error);
    res.status(500).json({ error: 'Failed to set custom claim' });
  }
};
