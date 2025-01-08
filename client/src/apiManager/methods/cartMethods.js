import { ApiMethods } from "../ApiMethods";
import CART_ENDPOINTS from "../endpoints/cartEndpoint";
import useSEE from "../useSEE";

/**
 * Custom hook that retrieves the cart data using Server-Sent Events (SSE).
 *
 * This hook internally calls the `useSEE` hook with the endpoint for the cart route.
 * The data fetched through SSE will be updated and returned by the `useSEE` hook.
 *
 * @returns {Object|null} The cart data received from the SSE endpoint or `null` if no data is available.
 *
 * @example
 * const cartData = useCart();
 * if (cartData) {
 *   // handle cart data
 * }
 */
export const getUserCart = () => {
    return ApiMethods.get(CART_ENDPOINTS.CART_ROUTE())
};

export const checkoutCart = () => {
    return ApiMethods.get(CART_ENDPOINTS.CHECKOUT)
}

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
export const addCartProduct = (productID, variant, size, quantity) => {
    return ApiMethods.post(CART_ENDPOINTS.CART_ROUTE(), {
        product: productID,
        variant,
        size,
        quantity
    })
};

/**
 * Updates the quantity of a product in the user's cart.
 * @param {string} cartProductID - The ID of the cart product to update.
 * @param {number} quantity - The new quantity of the product.
 * @returns {Promise<Object>} A promise that resolves to the updated cart data.
 * @example
 * // Update the product with ID 'prod123' to have a quantity of 5
 * updateCartProduct('prod123', 5)
 *   .then(updatedCart => console.log(updatedCart))
 *   .catch(err => console.error(err));
 */
export const updateCartProduct = (cartProductID, quantity) => {
    return ApiMethods.put(CART_ENDPOINTS.CART_ROUTE(), {
        cartProductID,
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
export const deleteCartProduct = (cartProductID) => {
    return ApiMethods.delete(CART_ENDPOINTS.CART_ROUTE(cartProductID));
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