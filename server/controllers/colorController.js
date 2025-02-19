import { db } from "../firebase.js";
import { COLLECTIONS } from "./utility.js"; 

export const checkColor = async (body) => {
    try {
        // Check if at least one field is present (in this case, 'collection')
        if (!body || !body.color) {
            return { isValid: true, errorMessage: null };
        }

        // Reference to the document in the "color" collection
        const colorRef = db.collection(COLLECTIONS.COLOR).doc(body.color);
        const colorDoc = await colorRef.get();

        // Return true if the document exists, otherwise false
        if (!colorDoc.exists) {
            return { isValid: false, errorMessage: `Color ${body.color} does not exist` };
          }
        
          return { isValid: true, errorMessage: null };  // Valid color

    } catch (error) {
        console.error('Error checking color:', error);
        throw new Error(`Unable to check color existence: ${error.message}`);
    }
}

export const checkColors = async (body) => {
    try {
        // Check if the 'variant' field is present in the body
        if (!body.variant) {
            return { isValid: true, errorMessage: null };  // If no 'variant', return true
        }

        // If 'variant' exists, loop through each object in the 'variant' array
        for (let variant of body.variant) {
            if (variant.color) {
            // Reference to the document in the "color" collection
            const colorRef = db.collection(COLLECTIONS.COLOR).doc(variant.color);
            const colorDoc = await colorRef.get();
    
            // If the color document doesn't exist, return false with error message
            if (!colorDoc.exists) {
                return { isValid: false, errorMessage: `Color ${variant.color} does not exist` };
            }
            }
        }
        
        return { isValid: true, errorMessage: null };  // Valid color

    } catch (error) {
        console.error('Error checking color:', error);
        throw new Error(`Unable to check color existence: ${error.message}`);
    }
}

export const getColors = async (req, res) => {
    try {
        const colorID = req.params.id;
        
        if (!colorID) {
            // Fetch all colors from the collection
            const snapshot = await db.collection(COLLECTIONS.COLOR).get();
            
            if (snapshot.empty) {
                return res.status(404).json({ message: 'No colors found' });
            }

            const colors = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return res.status(200).json(colors);
        } else {
            // Fetch a specific color by ID
            const docRef = db.collection(COLLECTIONS.COLOR).doc(colorID);
            const docSnapshot = await docRef.get();

            if (!docSnapshot.exists) {
                return res.status(404).json({ message: 'Color not found' });
            }

            return res.status(200).json({
                id: docSnapshot.id,
                ...docSnapshot.data()
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addcolor = async (req, res) => {

    try {
        const {code, ...colorCode} = req.body

        const exist = await checkColor({color: code});
        if (exist.isValid){
            return res.status(400).send(message(`Color with ID ${code} already exist.`))
        }

        db.collection(COLLECTIONS.COLOR).doc(code).create(colorCode)
        res.status(200).send("Color created successfully.")

    } catch (error) {
        res.status(400).send("Color failed to created.") 
    } 
}

export const deleteColor = async (req, res) => {
    try {
        const colorID = req.params.id;

        if (!colorID) {
            return res.status(400).send(message("Missing Color ID"));
        }

        const exist = await checkColor({color: colorID});
        if (!exist.isValid){
            return res.status(400).send(message(`Color with ID ${colorID} does not exist.`))
        }

        // Check if any product is under this color
        const q = db.collection("product").where("color", "array-contains", colorID);
        const querySnapshot = await q.count().get();

        if (querySnapshot.data().count > 0) {
            return res.status(409).send(message(`There are ${querySnapshot.data().count} products under this color.`));
        }

        await db.collection(COLLECTIONS.COLOR).doc(colorID).delete();
        res.status(200).send(message(`Color ${colorID} and its history successfully deleted.`));
    } catch (error) {
        console.error("Error deleting color:", error);
        res.status(500).send(message(message.erro));
    }
}
