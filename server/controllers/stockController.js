import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js"; 
import admin from 'firebase-admin'

export const getSkuStock = async (sku) => {
    try {
        const stockRef = db.collection(COLLECTIONS.STOCK).doc(sku)

        const stockSnapshot = await stockRef.get()

        if (!stockSnapshot.exists){
            return res.status(400).send(message("No SKU found."))
        } 

        res.status(200).send(stockSnapshot.data())

    } catch (error) {
        return res.status(400).send(message(error.message))
    }
}

export const getProductStock = async (productID) => {
    try {
        const stockQuery = db.collection(COLLECTIONS.STOCK)
            .orderBy(admin.firestore.FieldPath.documentId())
            .startAt(productID)
            .endAt(productID + '\uf8ff')
        
        const inventory = {}

        const stockSnapshot = await stockQuery.get();
        stockSnapshot.forEach((stock) => {
            const [prodID, variant, size] = stock.id.split('_'); // Split the document ID
            if (!inventory[variant]) {
                inventory[variant] = {};
            }
            inventory[variant][size] = stock.data().stock;
        });

        return inventory;
        
    } catch (error) {
        // throw new Error(error.message); // Throw the error to handle it at the calling site
        console.log(error.message);
    }
}

export const addStock = async (req, res) => {
    try {
        const { productID, size, variant, quantity } = req.body;

        // Generate the SKU as the document ID
        const sku = `${productID}_${variant}_${size}`;

        // Reference to the specific document in the 'stock' collection
        const stockDocRef = db.collection(COLLECTIONS.STOCK).doc(sku);

        // Get the existing document to check if it exists
        const stockDoc = await stockDocRef.get();

        if (stockDoc.exists) {
            // If document exists, update the stock field
            await stockDocRef.update({
                stock: stockDoc.data().stock + quantity, // Increment the stock
            });
        } else {
            // If document doesn't exist, return error
            return res.status(400).send(message("SKU does not exist. "));
        }

        res.status(200).send({ message: 'Stock updated successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const decreaseStock = async (req, res) => {
    try {
        const { productID, size, variant, quantity } = req.body;

        // Generate the SKU as the document ID
        const sku = `${productID}_${variant}_${size}`;

        // Reference to the specific document in the 'stock' collection
        const stockDocRef = db.collection(COLLECTIONS.STOCK).doc(sku);

        // Get the document to check stock availability
        const stockDoc = await stockDocRef.get();

        if (!stockDoc.exists) {
            return res.status(404).send({ message: 'Stock not found for the specified SKU' });
        }

        const currentStock = stockDoc.data().stock;

        if (currentStock < quantity) {
            return res.status(400).send({ message: 'Insufficient stock to fulfill the order' });
        }

        // Decrease the stock
        await stockDocRef.update({
            stock: currentStock - quantity,
        });

        res.status(200).send({ message: 'Stock decreased successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
