import { db } from "../firebase.js";
import { COLLECTIONS } from "./utility.js"; 

export const checkColor = async (body) => {
    try {
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
        // Reference to the document in the "color" collection
        const colorRef = db.collection(COLLECTIONS.COLOR).doc(body.color);
        const colorDoc = await colorRef.get();

        // Return true if the document exists, otherwise false
        if (!colorDoc.exists) {
            return { isValid: false, errorMessage: 'Color does not exist' };
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
        let result = null;

        if (!colorID){
            const colorSnapshot = await db.collection(COLLECTIONS.COLOR).get();
    
            if (colorSnapshot.empty) {
                console.log("No Color")
                return res.status(404).send(message('No Color found'));
            }
            result = colorSnapshot.docs.map((doc) => {
                const colorData = doc.data();
                return {
                    id: doc.id,
                    ...colorData
                };
            });

        } else {

            const colorSnapshot = await db.collection(COLLECTIONS.COLOR).doc(colorID).get();
    
            if (colorSnapshot.empty) {
                return res.status(404).send(message('No Color found'));
            } 
            
            const colorData = colorSnapshot.data();

            result = {
                id: colorSnapshot.id,
                ...colorData
            };
        }

        res.status(200).send(result);

      } catch (error) {
        res.status(500).send(message(error.message));
      }
}

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
