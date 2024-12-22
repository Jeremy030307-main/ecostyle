import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { COLLECTIONS, message } from './utility.js';

export const getReview = async (req, res) => {
    const productID = req.params.productID;

    if (!productID) {
        return res.status(400).send(message("Missing product ID."));
    }

    try {
        const reviewSnapshot = await db.collection(COLLECTIONS.REVIEW)
            .where("product", "==", productID)
            .get();

        if (reviewSnapshot.empty) {
            // Return an empty array for consistency
            return res.status(200).send([]);
        }

        // Process reviews, omitting 'product' field
        const reviews = reviewSnapshot.docs.map(doc => {
            const { product, ...reviewWithoutProduct } = doc.data();
            return {
                id: doc.id, // Include the review ID
                ...reviewWithoutProduct,
            };
        });

        res.status(200).send(reviews); // Respond with processed reviews
    } catch (error) {
        console.error(`Error fetching reviews for product ${productID}:`, error);
        res.status(500).send(message(`Failed to fetch reviews. ${error.message}`));
    }
};

export const addReview = async (req, res) => {

    const user = req.user;

    try {
        const productData = await db.collection(COLLECTIONS.PRODUCT).doc(req.body.product).get();
        if (!productData.exists){
            return res.status(404).send(message("Product not found."))
        }

        await db.collection(COLLECTIONS.REVIEW).add({
            ...req.body,
            // reviewer: user, 
            createdAt: admin.firestore.Timestamp.now() // Optionally store the creation date
        });
        res.status(200).send(message("Review Successfully Added"));

    } catch (error) {
        res.status(400).send(message(`Failed to add review. ${error.message}`));
    }
};

export const updateReview = async (req, res) => {

    const user = req.user;
    const reviewID = req.params.id;

    try {
        const reivewData = await db.collection(COLLECTIONS.REVIEW).doc(reviewID).get();
        if (!reivewData.exists){
            return res.status(404).send(message("Review not found."))
        }

        if (reivewData.data().reviewer !== req.user) {
            return res.status(403).send(message("Not authorise to make changes to this review."))
        }

        await db.collection(COLLECTIONS.REVIEW).doc(reviewID).update({
            ...req.body
        });

        res.status(200).send(message("Review Successfully Updated"));

    } catch (error) {
        res.status(400).send(message(`Failed to add review. ${error.message}`));
    }
};

export const deleteReview = async (req, res) => {
    const user = req.user;
    const reviewID = req.params.id;

    try {
        // Fetch the review data
        const reviewData = await db.collection(COLLECTIONS.REVIEW).doc(reviewID).get();
        if (!reviewData.exists) {
            return res.status(404).send(message("Review not found."));
        }

        // Check if the logged-in user is the owner of the review
        if (reviewData.data().reviewer !== user) {
            return res.status(403).send(message("Not authorized to delete this review."));
        }

        // Delete the review
        await db.collection(COLLECTIONS.REVIEW).doc(reviewID).delete();

        res.status(200).send(message("Review Successfully Deleted"));
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send(message(`Failed to delete review. ${error.message}`));
    }
};
