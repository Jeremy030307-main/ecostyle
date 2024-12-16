import { db } from "../firebase.js";
import admin from 'firebase-admin'
import { formatFirestoreTimestamps } from "./utility.js";

const FieldValue = admin.firestore.FieldValue;
const collection = 'collection'

const STATUS_TYPES = {
    NEW: "new",
    DRAFT: "draft",
    ACTIVE: "active",
    INACTIVE: "inactive",
    RETIRE: "retired"
};

const isValidStatus = (status) => Object.values(STATUS_TYPES).includes(status);

export const checkCollection = async (body) => {
    try {
        // Reference to the document in the "category" collection
        const collectionRef = db.collection(collection).doc(body.collection);
        const collectionDoc = await collectionRef.get();

        // Return true if the document exists, otherwise false
        if (!collectionDoc.exists) {
            return { isValid: false, errorMessage: 'Collection does not exist' };
          }
        
          return { isValid: true, errorMessage: null };  // Valid collection

    } catch (error) {
        console.error('Error checking category:', error);
        throw new Error(`Unable to check collection existence: ${error.message}`);
    }
}

export const getCollections = async (req, res) => {
    try {
        const collectionSnapshot = await db.collection(collection).where("status", "==", STATUS_TYPES.ACTIVE).get();
    
        if (collectionSnapshot.empty) {
          res.status(400).send('No Collection found');
        } else {
          const collectionArray = collectionSnapshot.docs.map((doc) => {
            const collectionData = doc.data();
            console.log(collectionData)
            return {
                id: doc.id,
                name: collectionData.name,
                description: collectionData.description,
            };
          });
      
          res.status(200).send(collectionArray);
        }
      } catch (error) {
        res.status(400).send(error.message);
      }
}

export const getCollection = async (req, res) => {
    try {

        const collectionID = req.params.id;
        const collectionSnapshot = await db.collection(collection).doc(collectionID).get();
    
        if (collectionSnapshot.empty) {
          res.status(400).send('No Collection found');
        } 
        
        const collectionData = collectionSnapshot.data()

        if (collectionData.status !== STATUS_TYPES.ACTIVE){
            res.status(400).send("No Collection Found")
        }

        res.status(200).send({
            id: collectionSnapshot.id,
            name: collectionData.name,
            description: collectionData.description
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// ------------------------------- Admin Action ----------------------------

export const addCollection = async (req, res) => {
    try{ 
        const {name, code , ...collectionData} = req.body;

        const data = {
            name: name,
            status: STATUS_TYPES.NEW,
            createdAt: admin.firestore.Timestamp.now(),
            ...collectionData
        }

        const collectionRef = db.collection(collection).doc(code);
        const statusHistoryRef = collectionRef.collection("history").doc();

        await db.runTransaction( async(t) => {

            // create the document for the new collection
            t.create(collectionRef, data);

            // Add status history document
            t.set(statusHistoryRef, {
                status: STATUS_TYPES.NEW,
                updatedAt: admin.firestore.Timestamp.now(),
            });
        });

        res.status(200).send("Collection created");

    } catch (error) {
        res.status(400).send(error.message)
    }   
}

export const updateCollection = async (req, res) => {
    try {
        const collectionID = req.params.id;
        const collectionData = req.body;

        if (!collectionData){
            return res.status(400).send(`Missing Request Body`)
        }

        const data = {
            updatedAt: admin.firestore.Timestamp.now(),
            ...collectionData
        }

        await db.collection(collection).doc(collectionID).update(collectionData)
        res.status(200).send(`Category Information Updated.`)

    } catch (error) {
        res.status(400).send(`Failed To Update Data: ${error.message}`)
    }
}

export const updateCollectionStatus = async (req, res) => {
    try {
        const collectionID = req.params.id;
        const status = req.params.status;

        // Check if collectionID and status are provided
        if (!collectionID || !status) {
            return res.status(400).send({
                error: "Missing parameters",
                requiredParams: ["collectionID", "status"],
            });
        }

        // Validate status
        if (!isValidStatus(status)) {
            return res.status(400).send({
                error: "Invalid status",
                validStatus: Object.values(STATUS_TYPES),
            });
        }

        // Reference the Firestore document for the collection
        const collectionRef = db.collection(collection).doc(collectionID);
        const statusHistoryRef = collectionRef.collection("history").doc();

        await db.runTransaction(async (t) => {

            const collectionDoc = await t.get(collectionRef);

            if (!collectionDoc.exists) {
                throw new Error("Collection not found");
            }

            const currentData = collectionDoc.data();
            const currentStatus = currentData.status;

            if (currentStatus === status) {
                throw new Error(`Status is already set to the "${status}"`);
            }

            // Update the status and add history
            const updatedAt = admin.firestore.Timestamp.now();

            t.set(statusHistoryRef, {
                status: status,
                updatedAt: updatedAt,
            });

            t.update(collectionRef, {
                status: status,
                updatedAt: updatedAt,
            });
        });

        res.status(200).send({ message: "Collection status updated successfully" });

    } catch (error) {
        res.status(400).send({ error: error.message || "Internal server error" });
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const collectionID = req.params.id;

        if (!collectionID) {
            return res.status(400).send("Missing Collection ID");
        }

        const collectionRef = db.collection(collection).doc(collectionID);

        // Check if any product is under this collection
        const q = db.collection("product").where("collection", "==", collectionRef);
        const querySnapshot = await q.count().get();

        if (querySnapshot.data().count > 0) {
            return res.status(400).send({
                error: "Collection unable to remove.",
                message: `There are ${querySnapshot.data().count} products under this collection.`
            });
        }

        // Delete all documents in the "history" subcollection
        const historySnapshot = await collectionRef.collection("history").get();

        // Deleting each document in the "history" subcollection
        const batch = db.batch();
        historySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        batch.delete(collectionRef);

        // Commit the batch to delete all history documents
        await batch.commit();

        res.status(200).send(`Collection ${collectionID} and its history successfully deleted.`);
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(400).send("Failed to delete collection.");
    }
}

export const getCollectionDetail = async (req, res) => {
    try {
        const collectionID = req.params.id;
        const collectionRef = db.collection(collection).doc(collectionID);
        const historyCollection = collectionRef.collection("history");

        await db.runTransaction(async (t) => {
            // Retrieve the main collection document
            const collectionSnapshot = await t.get(collectionRef);

            if (!collectionSnapshot.exists) {
                return res.status(400).send('No Collection found');
            }

            const data = formatFirestoreTimestamps(collectionSnapshot.data());

            // Retrieve documents in the "history" subcollection
            const historySnapshot = await t.get(historyCollection);

            const statusHistory = [];
            historySnapshot.forEach(doc => {
                const historyData = formatFirestoreTimestamps(doc.data());
                statusHistory.push(historyData);
            });

            // Add the statusHistory array to the main document
            data.statusHistory = statusHistory;

            res.status(200).send(data);
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
};

