import { ApiMethods } from "../ApiMethods";
import WISHLIST_ENDPOINTS from "../endpoints/wishlistEndpoint";


export const getUserWishlist = () => {
    return ApiMethods.get(WISHLIST_ENDPOINTS.WISHLIST_ROUTE())
};

export const addwishlistProduct = (productID) => {
    return ApiMethods.post(WISHLIST_ENDPOINTS.WISHLIST_ROUTE(productID), {})
};

/**
 * Deletes a product from the user's cart.
 * @param {string} productID - The ID of the product to remove.
 * @returns {Promise<Object>} A promise that resolves to the updated cart data.
 * @example
 * // Remove the product with ID 'prod123' from the cart
 * deleteCartProduct('prod123')
 *   .then(updatedCart => console.log(updatedCart))
 *   .catch(err => console.error(err));
 */
export const deleteWishlsitProduct = (productID) => {
    return ApiMethods.delete(WISHLIST_ENDPOINTS.WISHLIST_ROUTE(productID));
}