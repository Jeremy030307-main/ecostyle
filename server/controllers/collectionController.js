import { db } from "../firebase.js";
import admin from 'firebase-admin'
import { COLLECTIONS, formatFirestoreTimestamps, message } from "./utility.js";

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
        // Check if at least one field is present (in this case, 'collection')
        if (!body || !body.collection) {
            return { isValid: true, errorMessage: null };
        }
        // Reference to the document in the "category" collection
        const collectionRef = db.collection(COLLECTIONS.COLLECTION).doc(body.collection);
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

export const getCollection = async (req, res) => {
    try {

        const collectionID = req.params.id;
        let result = null;

        if (!collectionID){
            const collectionSnapshot = await db.collection(COLLECTIONS.COLLECTION).where("status", "==", STATUS_TYPES.ACTIVE).get();
    
            if (collectionSnapshot.empty) {
                console.log("No Collection")
                return res.status(404).send(message('No Collection found'));
            }
            result = collectionSnapshot.docs.map((doc) => {
                const { createdAt, updatedAt, status, ...collectionData } = doc.data();
                console.log(collectionData)
                return {
                    id: doc.id,
                    ...collectionData
                };
            });

        } else {

            const collectionSnapshot = await db.collection(COLLECTIONS.COLLECTION).doc(collectionID).get();
    
            if (collectionSnapshot.empty) {
                return res.status(404).send(message('No Collection found'));
            } 
            
            const { createdAt, updatedAt, status, ...collectionData } = collectionSnapshot.data();
            
            if (status !== STATUS_TYPES.ACTIVE){
                return res.status(404).send(message('No Collection found'));
            }

            result = {
                id: collectionSnapshot.id,
                ...collectionData
            };
        }

        res.status(200).send(result);

      } catch (error) {
        res.status(500).send(message(error.message));
      }
}

// ------------------------------- Admin Action ----------------------------

export const addCollection = async (req, res) => {
    try{ 
        const {name, id , ...collectionData} = req.body;

        const data = {
            name: name,
            status: STATUS_TYPES.NEW,
            createdAt: admin.firestore.Timestamp.now(),
            ...collectionData
        }

        const collectionRef = db.collection(COLLECTIONS.COLLECTION).doc(id);
        const statusHistoryRef = collectionRef.collection(COLLECTIONS.COLLECTION_HISTROY).doc();

        const exist = await checkCollection({collection: id});
        if (exist.isValid){
            return res.status(400).send(message(`Category with ID ${id} already exist.`))
        }

        await db.runTransaction( async(t) => {

            // create the document for the new collection
            t.create(collectionRef, data);

            // Add status history document
            t.set(statusHistoryRef, {
                status: STATUS_TYPES.NEW,
                updatedAt: admin.firestore.Timestamp.now(),
            });
        });

        res.status(201).send(message("Collection created"));

    } catch (error) {
        res.status(500).send(message(error.message))
    }   
}

export const updateCollection = async (req, res) => {
    try {
        const collectionID = req.params.id;
        const collectionData = req.body;

        const exist = await checkCollection({collection: collectionID});
        if (!exist.isValid){
            return res.status(400).send(message(`Category with ID ${collectionID} does not exist.`))
        }

        const data = {
            updatedAt: admin.firestore.Timestamp.now(),
            ...collectionData
        }

        await db.collection(COLLECTIONS.COLLECTION).doc(collectionID).update(data)
        res.status(200).send(message(`Category Information Updated.`))

    } catch (error) {
        res.status(500).send(message(`Failed To Update Data: ${error.message}`))
    }
}

export const updateCollectionStatus = async (req, res) => {
    try {
        const collectionID = req.params.id;
        const status = req.params.status;

        // Check if collectionID and status are provided
        if (!collectionID || !status) {
            return res.status(400).send(message("Missing parameters {collectionID, status}"))
        }

        const exist = await checkCollection({collection: collectionID});
        if (!exist.isValid){
            return res.status(400).send(message(`Category with ID ${collectionID} does not exist.`))
        }

        // Validate status
        if (!isValidStatus(status)) {
            return res.status(400).send(message("Invalid Status"));
        }

        // Reference the Firestore document for the collection
        const collectionRef = db.collection(COLLECTIONS.COLLECTION).doc(collectionID);
        const statusHistoryRef = collectionRef.collection(COLLECTIONS.COLLECTION_HISTROY).doc();

        await db.runTransaction(async (t) => {

            const collectionDoc = await t.get(collectionRef);

            if (!collectionDoc.exists) {
                throw new Error("Collection not found");
            }

            const currentData = collectionDoc.data();
            const currentStatus = currentData.status;

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

        res.status(200).send(message("Collection status updated successfully"));

    } catch (error) {
        res.status(500).send(message(error.message));
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const collectionID = req.params.id;

        if (!collectionID) {
            return res.status(400).send(message("Missing Collection ID"));
        }

        const exist = await checkCollection({collection: collectionID});
        if (!exist.isValid){
            return res.status(400).send(message(`Category with ID ${collectionID} does not exist.`))
        }

        const collectionRef = db.collection(COLLECTIONS.COLLECTION).doc(collectionID);

        // Check if any product is under this collection
        const q = db.collection("product").where("collection", "==", collectionRef);
        const querySnapshot = await q.count().get();

        if (querySnapshot.data().count > 0) {
            return res.status(409).send(message(`There are ${querySnapshot.data().count} products under this collection.`));
        }

        // Delete all documents in the "history" subcollection
        const historySnapshot = await collectionRef.collection(COLLECTIONS.COLLECTION_HISTROY).get();

        // Deleting each document in the "history" subcollection
        const batch = db.batch();
        historySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        batch.delete(collectionRef);

        // Commit the batch to delete all history documents
        await batch.commit();

        res.status(200).send(message(`Collection ${collectionID} and its history successfully deleted.`));
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).send(message(message.erro));
    }
}

export const getCollectionDetail = async (req, res) => {
    try {
        const collectionID = req.params.id;

        // If collectionID is not provided, return all collections
        if (!collectionID) {
            const collectionsRef = db.collection(COLLECTIONS.COLLECTION);
            const collectionsSnapshot = await collectionsRef.get();

            if (collectionsSnapshot.empty) {
                return res.status(404).send(message('No collections found'));
            }

            const collections = [];
            collectionsSnapshot.forEach(doc => {
                const collectionData = formatFirestoreTimestamps(doc.data());
                collections.push({id: doc.id, ...collectionData});
            });

            return res.status(200).send(collections);
        }

        // If collectionID is provided, get the specific collection and its history
        const collectionRef = db.collection(COLLECTIONS.COLLECTION).doc(collectionID);
        const historyCollection = collectionRef.collection(COLLECTIONS.COLLECTION_HISTROY);

        await db.runTransaction(async (t) => {
            // Retrieve the main collection document
            const collectionSnapshot = await t.get(collectionRef);

            if (!collectionSnapshot.exists) {
                return res.status(400).send(message('No Collection found'));
            }

            let data = formatFirestoreTimestamps(collectionSnapshot.data());

            // Retrieve documents in the "history" subcollection
            const historySnapshot = await t.get(historyCollection);

            const statusHistory = [];
            historySnapshot.forEach(doc => {
                const historyData = formatFirestoreTimestamps(doc.data());
                statusHistory.push(historyData);
            });

            // Add the statusHistory array to the main document
            data.statusHistory = statusHistory;
            return data
        })
        .then((result) => res.status(200).send({id: collectionID, ...result}))

    } catch (error) {
        res.status(500).send(message(error.message));
    }
};

