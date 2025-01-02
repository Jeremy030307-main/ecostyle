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

export const getColors = (req, res) => {
    const colorID = req.params.id;

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Content-Encoding', "none");
    res.flushHeaders(); // Flush headers to establish SSE connection

    try {
        if (!colorID) {
            // Listen for real-time changes to the entire collection
            const colorSnapshot = db.collection(COLLECTIONS.COLOR);

            const unsubscribe = colorSnapshot.onSnapshot(snapshot => {
                if (snapshot.empty) {
                    console.log("No Color found");
                    return res.status(404).send(message('No Color found'));
                }

                const colors = snapshot.docs.map(doc => {
                    const colorData = doc.data();
                    return {
                        id: doc.id,
                        ...colorData
                    };
                });

                // Send the updated data to the client
                res.write(`data: ${JSON.stringify(colors)}\n\n`);
            });

            // Close the listener when the connection is closed
            req.on('close', () => {
                console.log("Connection closed, unsubscribing...");
                unsubscribe();
            });

        } else {
            // Listen for real-time updates for a specific color
            const colorSnapshot = db.collection(COLLECTIONS.COLOR).doc(colorID);

            const unsubscribe = colorSnapshot.onSnapshot(docSnapshot => {
                if (!docSnapshot.exists) {
                    return res.status(404).send(message('No Color found'));
                }

                const colorData = docSnapshot.data();
                const result = {
                    id: docSnapshot.id,
                    ...colorData
                };

                // Send the updated data to the client
                res.write(`data: ${JSON.stringify(result)}\n\n`);
            });

            // Close the listener when the connection is closed
            req.on('close', () => {
                console.log("Connection closed, unsubscribing...");
                unsubscribe();
            });
        }

    } catch (error) {
        res.status(500).send(message(error.message));
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
