import { ApiMethods } from "../ApiMethods";
import REVIEW_ENDPOINTS from "../endpoints/reviewEndpoint";
import useSEE from "../useSEE";

/**
 * Fetches reviews for a specific product.
 * 
 * @param {string} productID - The ID of the product for which to fetch reviews.
 * @param {Object} [query] - Optional query parameters to filter or sort reviews.
 * @param {number} [query.rating] - Filter reviews by a specific rating.
 * @param {string} [query.sortBy] - Sort reviews by a specific field (e.g., "rating" or "createdAt").
 * @returns {Promise<Object[]>} - A promise that resolves to an array of reviews.
 * Each review in the array contains:
 *   - {string} reviewID - Unique identifier of the review.
 *   - {number} rating - Rating given to the product (1 to 5).
 *   - {string} comment - Comment about the product.
 *   - {string} reviewer - Identifier of the reviewer.
 *   - {string} id - ID of the product being reviewed.
 *   - {string} createdAt - Timestamp of when the review was created.
 *   - {string} updatedAt - Timestamp of when the review was last updated.
 * 
 * @example
 * // Example usage:
 * const productID = "12345";
 * const query = { rating: 5, sortBy: "createdAt" };
 * 
 * getProductReview(productID, query)
 *   .then(reviews => {
 *       console.log(reviews);
 *       // Example response:
 *       // [
 *       //   {
 *       //     reviewID: "r1",
 *       //     rating: 5,
 *       //     comment: "Great product!",
 *       //     reviewer: "user1",
 *       //     id: "12345",
 *       //     createdAt: "2023-12-20T12:00:00Z",
 *       //     updatedAt: "2023-12-21T12:00:00Z"
 *       //   },
 *       //   {
 *       //     reviewID: "r2",
 *       //     rating: 4,
 *       //     comment: "Good quality, but a bit expensive.",
 *       //     reviewer: "user2",
 *       //     id: "12345",
 *       //     createdAt: "2023-12-19T12:00:00Z",
 *       //     updatedAt: "2023-12-20T12:00:00Z"
 *       //   }
 *       // ]
 *   })
 *   .catch(error => {
 *       console.error("Error fetching reviews:", error);
 *   });
 */
export const getProductReview = (productID, query) => {
    // Construct base URL for the reviews endpoint
    let url = REVIEW_ENDPOINTS.REVIEW_ROUTE(productID);

    // If query parameters are provided, append them to the URL
    if (query && Object.keys(query).length > 0) {
        const queryString = new URLSearchParams(query).toString();
        url += `?${queryString}`;
    }

    return ApiMethods.get(url);
};

/**
 * Fetches reviews for current user.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of reviews.
 * Each review in the array contains:
 *   - {string} reviewID - Unique identifier of the review.
 *   - {number} rating - Rating given to the product (1 to 5).
 *   - {string} comment - Comment about the product.
 *   - {string} product - Identifier of the product.
 *   - {string} id - ID of the product being reviewed.
 *   - {string} createdAt - Timestamp of when the review was created.
 *   - {string} updatedAt - Timestamp of when the review was last updated.
 */
export const getUserReview = () => {
    return ApiMethods.get(REVIEW_ENDPOINTS.REVIEW_ROUTE())
}

export const createNewReview = (productID, rating, comment) => {

    const body = {
        product: productID,
        rating, 
        comment
    }

    return ApiMethods.post(REVIEW_ENDPOINTS.REVIEW_ROUTE(), body);
};

export const editReview = (reviewID, rating, comment) => {
    // Initialize an empty object for the request body
    const body = {};

    // Conditionally add the rating if it is neither null nor undefined
    if (rating != null) { // Checks for both undefined and null
        body.rating = rating;
    }

    // Conditionally add the comment if it is neither null nor undefined
    if (comment != null) { // Checks for both undefined and null
        body.comment = comment;
    }

    // Send the PATCH request with the body that only includes provided fields
    return ApiMethods.patch(REVIEW_ENDPOINTS.REVIEW_ROUTE(reviewID), body);
};

export const deleteReview = (reviewID) => {
    return ApiMethods.delete(REVIEW_ENDPOINTS.REVIEW_ROUTE(reviewID))
};