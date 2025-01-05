import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { COLLECTIONS, message } from './utility.js';

export const getProductReview = async (req, res) => {
    const productID = req.params.productID;
    const { rating } = req.query; // Extract query parameters

    // Ensure that the product ID is provided
    if (!productID) {
        return res.status(400).send({ message: "Missing product ID." });
    }

    try {
        // Set up the Firestore query to fetch reviews for the product
        let reviewQuery = db.collection(COLLECTIONS.REVIEW)
            .where("product", "==", productID);
        
        // Apply additional filtering based on the 'rating' query parameter
        if (rating) {
            const ratingValue = parseFloat(rating);
            if (isNaN(ratingValue)) {
                return res.status(400).send({ message: "Invalid rating value." });
            }
            reviewQuery = reviewQuery.where("rating", "==", ratingValue);
        }

        // Execute the query
        const snapshot = await reviewQuery.get();

        // Check if there are reviews for the product
        if (snapshot.empty) {
            return res.status(404).send({ message: 'No Reviews found' });
        }

        let reviews = []
        for (const doc of snapshot.docs) {
            const reviewData = doc.data();
            const { product, reviewer, ...reviewWithoutProduct } = reviewData;
            
            // Fetch the user info using the reviewer (user ID) field
            const userRecord = await admin.auth().getUser(reviewer);

            const userData = userRecord.displayName

            // Add user data along with review information
            reviews.push({
                id: doc.id, // Include the review ID
                ...reviewWithoutProduct,
                user: userData // Include user information
            });
        }

        // Return the reviews in the response
        return res.status(200).json(reviews);
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching reviews:', error);
        return res.status(500).send({ message: error.message });
    }
};


export const getUserReview = async (req, res) => {
    const userID = req.user;

    try {
        const reviewSnapshot = await db.collection(COLLECTIONS.REVIEW)
            .where("reviewer", "==", userID)
            .get();

        if (reviewSnapshot.empty) {
            // Return an empty array for consistency
            return res.status(200).send([]);
        }

        // Process reviews, omitting 'product' field
        const reviews = reviewSnapshot.docs.map(doc => {
            const { reviewer, ...reviewWithoutProduct } = doc.data();
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
    const productID = req.body.product;

    try {
        const result = await db.runTransaction(async (transaction) => {
            // Get the product document
            const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);
            const productDoc = await transaction.get(productRef);
            
            // Check if the product exists
            if (!productDoc.exists) {
                throw new Error("Product not found.");
            }

            // Check if the user has already reviewed the product
            const reviewQuery = db.collection(COLLECTIONS.REVIEW)
                .where("product", "==", productID)
                .where("reviewer", "==", user);
            const existingReview = await transaction.get(reviewQuery);
            if (!existingReview.empty) {
                throw new Error("User has already reviewed this product.");
            }

            // Add the new review document
            const reviewRef = db.collection(COLLECTIONS.REVIEW).doc();
            transaction.set(reviewRef, {
                ...req.body,
                reviewer: user,
            });

            // Update the product's review count and rating (if needed)
            const currentReviewCount = productDoc.data().reviewCount || 0;
            const newReviewCount = currentReviewCount + 1;
            
            // Here, you can calculate the new average rating if you want
            const currentRating = productDoc.data().rating || 0;
            const newRating = (currentRating * currentReviewCount + req.body.rating) / newReviewCount;

            transaction.update(productRef, {
                reviewCount: newReviewCount,
                rating: newRating,
            });

            return "Review successfully added.";
        });

        res.status(200).send(message(result));

    } catch (error) {
        res.status(400).send(message(`Failed to add review. ${error.message}`));
    }
};

export const updateReview = async (req, res) => {
    const user = req.user;
    const reviewID = req.params.id;
    const newRating = req.body.rating;

    try {
        const result = await db.runTransaction(async (transaction) => {
            // Fetch the review document
            const reviewRef = db.collection(COLLECTIONS.REVIEW).doc(reviewID);
            const reviewDoc = await transaction.get(reviewRef);
            
            // Check if the review exists
            if (!reviewDoc.exists) {
                throw new Error("Review not found.");
            }

            // Check if the logged-in user is the reviewer of the review
            if (reviewDoc.data().reviewer !== user) {
                throw new Error("Not authorized to update this review.");
            }

            // Get the product reference and document
            const productRef = db.collection(COLLECTIONS.PRODUCT).doc(reviewDoc.data().product);
            const productDoc = await transaction.get(productRef);
            
            // Check if the product exists
            if (!productDoc.exists) {
                throw new Error("Product not found.");
            }

            // Update the review with the new data
            transaction.update(reviewRef, req.body);

            // Check if the rating has changed and if so, update the product's rating
            const currentRating = productDoc.data().rating || 0;
            const currentReviewCount = productDoc.data().reviewCount || 0;

            if (newRating !== undefined && newRating !== currentRating) {
                // Calculate the new average rating for the product
                const totalRating = currentRating * currentReviewCount;
                const newAverageRating = (totalRating - currentRating + newRating) / currentReviewCount;

                // Update the product's rating
                transaction.update(productRef, {
                    rating: newAverageRating,
                });
            }

            return "Review successfully updated.";
        });

        res.status(200).send(message(result));

    } catch (error) {
        res.status(400).send(message(`Failed to update review. ${error.message}`));
    }
};

export const deleteReview = async (req, res) => {
    const user = req.user;
    const reviewID = req.params.id;

    try {
        const result = await db.runTransaction(async (transaction) => {
            // Fetch the review document
            const reviewRef = db.collection(COLLECTIONS.REVIEW).doc(reviewID);
            const reviewDoc = await transaction.get(reviewRef);

            // Check if the review exists
            if (!reviewDoc.exists) {
                throw new Error("Review not found.");
            }

            // Check if the logged-in user is the reviewer of the review
            if (reviewDoc.data().reviewer !== user) {
                throw new Error("Not authorized to delete this review.");
            }

            // Get the product reference and document
            const productRef = db.collection(COLLECTIONS.PRODUCT).doc(reviewDoc.data().product);
            const productDoc = await transaction.get(productRef);

            // Check if the product exists
            if (!productDoc.exists) {
                throw new Error("Product not found.");
            }

            // Delete the review
            transaction.delete(reviewRef);

            // Recalculate the product's rating and reviewCount
            const currentRating = productDoc.data().rating || 0;
            const currentReviewCount = productDoc.data().reviewCount || 0;

            if (currentReviewCount > 1) {
                // Recalculate the new average rating after deleting the review
                const totalRating = currentRating * currentReviewCount;
                const newReviewCount = currentReviewCount - 1;
                const newAverageRating = (totalRating - reviewDoc.data().rating) / newReviewCount;

                // Update the product's rating and review count
                transaction.update(productRef, {
                    rating: newAverageRating,
                    reviewCount: newReviewCount,
                });
            } else {
                // If there's only one review left, set the rating to 0 and review count to 0
                transaction.update(productRef, {
                    rating: 0,
                    reviewCount: 0,
                });
            }

            return "Review successfully deleted and product updated.";
        })
        .then((result) => res.status(200).send(message(result)))
        .catch((error) => res.status(400).send(message(error.message)))

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send(message(`Failed to delete review. ${error.message}`));
    }
};
