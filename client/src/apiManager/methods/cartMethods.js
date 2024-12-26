import { ApiMethods } from "../ApiMethods";
import CART_ENDPOINTS from "../endpoints/cartEndpoint";

/**
 * Fetches the user's cart information.
 * @returns {Promise<Object>} A promise that resolves to the user's cart data.
 * @example
 * // Fetch the user's cart and log it to the console
 * getUserCart()
 *   .then(cart => console.log(cart))
 *   .catch(err => console.error(err));
 */
export const getUserCart = () => {
    return ApiMethods.get(CART_ENDPOINTS.CART_ROUTE());
};

/**
 * Adds a product to the user's cart.
 * @param {string} productID - The ID of the product to add to the cart.
 * @param {number} quantity - The quantity of the product to add.
 * @returns {Promise<Object>} A promise that resolves to the updated cart data.
 * @example
 * // Add a product with ID 'prod123' and quantity 2 to the cart
 * addCartProduct('prod123', 2)
 *   .then(updatedCart => console.log(updatedCart))
 *   .catch(err => console.error(err));
 */
export const addCartProduct = (productID, quantity) => {
    return ApiMethods.post(CART_ENDPOINTS.CART_ROUTE(), {
        product: productID,
        quantity
    })
};

/**
 * Updates the quantity of a product in the user's cart.
 * @param {string} productID - The ID of the product to update.
 * @param {number} quantity - The new quantity of the product.
 * @returns {Promise<Object>} A promise that resolves to the updated cart data.
 * @example
 * // Update the product with ID 'prod123' to have a quantity of 5
 * updateCartProduct('prod123', 5)
 *   .then(updatedCart => console.log(updatedCart))
 *   .catch(err => console.error(err));
 */
export const updateCartProduct = (productID, quantity) => {
    return ApiMethods.put(CART_ENDPOINTS.CART_ROUTE(), {
        product: productID,
        quantity
    })
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
export const deleteCartProduct = (productID) => {
    return ApiMethods.delete(CART_ENDPOINTS.CART_ROUTE(productID));
}


/**
 * Clears all products from the user's cart.
 * @returns {Promise<Object>} A promise that resolves to the cleared cart data.
 * @example
 * // Clear the cart and log the response
 * clearCart()
 *   .then(response => console.log('Cart cleared:', response))
 *   .catch(err => console.error(err));
 */
export const clearCart = () => {
    return ApiMethods.delete(CART_ENDPOINTS.CART_ROUTE());
};