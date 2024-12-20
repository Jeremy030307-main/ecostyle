import { db } from "../firebase.js";
import { COLLECTIONS } from "./utility.js";

export const checkColor = async (body) => {
    try {
        // Reference to the document in the "category" collection
        const colorRef = db.collection(COLLECTIONS.COLOR).doc(body.color);
        const colorDoc = await colorRef.get();

        // Return true if the document exists, otherwise false
        if (!colorDoc.exists) {
            return { isValid: false, errorMessage: `Color ${body.color} does not exist` };
          }
        
          return { isValid: true, errorMessage: null };  // Valid collection

    } catch (error) {
        console.error('Error checking color:', error);
        throw new Error(`Unable to check color existence: ${error.message}`);
    }
}

export const checkColors = async (body) => {
    try {
        // Reference to the document in the "category" collection
        const colorRef = db.collection(COLLECTIONS.COLOR).doc(body.color);
        const colorDoc = await colorRef.get();

        // Return true if the document exists, otherwise false
        if (!colorDoc.exists) {
            return { isValid: false, errorMessage: 'Color does not exist' };
          }
        
          return { isValid: true, errorMessage: null };  // Valid collection

    } catch (error) {
        console.error('Error checking color:', error);
        throw new Error(`Unable to check color existence: ${error.message}`);
    }
}

export const addcolor = async (req, res) => {

    try {
        const {code, ...colorCode} = req.body
        db.collection(COLLECTIONS.COLOR).doc(code).create(colorCode)
        res.status(200).send("Color created successfully.")

    } catch (error) {
        res.status(400).send("Color failed to created.")
    }
}