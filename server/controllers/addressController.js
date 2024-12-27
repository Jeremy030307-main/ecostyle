import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { COLLECTIONS, message } from './utility.js';

// get all user address
export const getUserAddress = async (req, res, next) => {

    try {
      const userID = req.user;
  
      const addressRef = db.collection(COLLECTIONS.USER).doc(userID).collection(COLLECTIONS.ADDRESS);
      const addressSnapshot =  await addressRef.get();
  
      if (addressSnapshot.empty) {
        console.log("fdfdfdf4")
  
        return res.status(200).send([]);
      }
      console.log("fdfdfdf")
  
      // Extract addresses from the snapshot
      const addresses = addressSnapshot.docs.map((doc) => ({
        ...doc.data(), // Address data
      }));
  
      res.status(200).send(addresses);
    } catch (error) {
  
    }
  }
  
  // let user to add an address
  export const addNewAddress = async (req, res, next) => {
    try {
      const userID = req.user;
      const addressBookData = req.body;
  
      const addressRef = db.collection(COLLECTIONS.USER).doc(userID).collection(COLLECTIONS.ADDRESS).doc(addressBookData.addressName);
  
      const docSnapshot = await addressRef.get();
  
      if (docSnapshot.exists) {
  
        const addedDoc = await addressRef.update(addressBookData);
        res.status(201).send(message("Address updated."));
  
      } else {
  
        const addedDoc = await addressRef.set(addressBookData);
        res.status(201).send(message("Address added."));
  
      }
    } catch (error) {
      res.status(400).send(message(`Failed to add address: ${error.message}`))
    }
  };
  
  export const updateAddress = async (req, res, next) => {
    const { addressName } = req.params;
    const userID = req.user;
    const addressBookData = req.body;
  
    // Start a Firestore transaction
    const dbRef = db.collection(COLLECTIONS.USER).doc(userID).collection(COLLECTIONS.ADDRESS);
    
    try {
      await db.runTransaction(async (transaction) => {
        const addressRef = dbRef.doc(addressName);
  
        // Get the existing address document within the transaction
        const existingAddressDoc = await transaction.get(addressRef);
  
        // Check if the address document exists
        if (!existingAddressDoc.exists) {
          throw new Error("Address not found.");
        }
  
        // If the addressName is different, delete the old document and add the new one
        if (addressName !== addressBookData.addressName) {
          // Delete the old document
          transaction.delete(addressRef);
  
          // Reference to the new address document with the updated addressName
          const newAddressRef = dbRef.doc(addressBookData.addressName);
  
          // Set the new address data in the new document
          transaction.set(newAddressRef, addressBookData);
        } else {
          // If the addressName is not changed, just update the existing document
          transaction.update(addressRef, addressBookData);
        }
      });
  
      res.status(201).send(message("Address updated successfully."));
    } catch (error) {
      res.status(400).send(message(`Failed to update address: ${error.message}`));
    }
  };  
  
  export const deleteAddress = async (req, res) => {
    try {
      const { addressName } = req.params;
      const userID = req.user;
  
      const addressRef = db.collection(COLLECTIONS.USER).doc(userID).collection(COLLECTIONS.ADDRESS).doc(addressName);
  
      await addressRef.delete();
      res.status(201).send(message("Address deleted."));
  
    } catch (error) {
      res.status(400).send(message(`Failed to deleted address: ${error.message}`))
    }
  
  }