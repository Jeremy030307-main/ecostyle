import { ApiMethods } from "../ApiMethods";
import PRODUCT_ENDPOINTS from "../endpoints/productEndpoint";

/**
 * Fetches product data from the API based on the provided product ID and query parameters.
 *
 * @param {string} [productID=""] - The ID of the product to fetch. Defaults to an empty string, meaning no specific product.
 * @param {Object} [query={}] - An object containing query parameters for the request. Only applied if no product ID is provided.
 * @param {string} [query.category] - The category of the product (e.g., "men", "women").
 * @param {string} [query.collection] - The collection name of the product (e.g., "Eo Root").
 * @param {string} [query.color] - The color of the product (e.g., "red", "blue").
 * @param {string} [query.sortby] - The field to sort the products by. Currently only supports `"price"`.
 * @param {string} [query.orderby] - The order of sorting. Can be `"asc"` for ascending or `"desc"` for descending.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 *
 * @throws {Error} - Throws an error if the API request fails.
 *
 * @example
 * // Fetch a specific product by ID
 * getProduct("123").then(product => console.log(product));
 *
 * @example
 * // Fetch products with query parameters
 * getProduct("", {
 *   category: "men",
 *   collection: "Eo Root",
 *   color: "red",
 *   sortby: "price",
 *   orderby: "asc"
 * }).then(products => console.log(products));
 */
export const getProduct = (productID = "", query = {}) => {
    let url = PRODUCT_ENDPOINTS.PRODUCT_ROUTE(productID);

    // Only add query string if productID is not provided
    if (!productID) {
        const queryString = new URLSearchParams(query).toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    return ApiMethods.get(url);
};

/**
 * Adds a new product to the system.
 * 
 * @param {Object} productData - The data to create the product.
 * @param {string} productData.name - The name of the product (required).
 * @param {number} productData.price - The price of the product (required, must be non-negative).
 * @param {string|null} [productData.thumbnail=null] - URL of the product's thumbnail image (optional).
 * @param {string[]} productData.sizes - Array of sizes the product is available in (e.g., ['S', 'M', 'L', 'XL']) (required).
 * @param {Object} [productData.details={}] - Additional details about the product (optional).
 * @param {string} [productData.details.description] - Product description (optional).
 * @param {string} [productData.details.material] - Material of the product (optional).
 * @param {string} [productData.details.fit] - Fit type of the product (optional).
 * @param {string} productData.category - The ID of the product's category (required).
 * @param {string} productData.collection - The ID of the collection to associate the product with (required).
 * @param {Object[]} productData.variants - Array of product variants (required).
 * @param {string} productData.variants[].color - Color of the variant (required).
 * @param {string|null} [productData.variants[].image=null] - URL of the variant's image.
 * 
 * @returns {Promise<Object>} A promise that resolves to the response from the API call.
 * 
 * @example
 * // Example usage of the addProduct function:
 * const productData = {
 *   name: "Cotton T-Shirt",
 *   price: 19.99,
 *   thumbnail: "https://example.com/images/t-shirt-thumbnail.jpg",
 *   sizes: ["S", "M", "L", "XL"],
 *   details: {
 *     description: "A comfortable cotton t-shirt, perfect for everyday wear.",
 *     material: "100% Cotton",
 *     fit: "Regular"
 *   },
 *   category: "clothing",
 *   collection: "summer2024",
 *   variants: [
 *     {
 *       color: "Red",
 *       image: "https://example.com/images/t-shirt-red.jpg"
 *     },
 *     {
 *       color: "Blue",
 *       image: "https://example.com/images/t-shirt-blue.jpg"
 *     }
 *   ]
 * };
 * 
 * addProduct(productData)
 *   .then(response => {
 *     console.log("Product added successfully:", response);
 *   })
 *   .catch(error => {
 *     console.error("Error adding product:", error);
 *   });
 */
export const addProduct = (productData) => {
    return ApiMethods.post(PRODUCT_ENDPOINTS.ADMIN_PRODUCT_ROUTE(), productData);
}

/**
 * Updates the product data based on the provided product ID and product data.
 * At least one of the following fields must be included in the `productData` object: 
 * `name`, `price`, `thumbnail`, `details`, `category`, or `collection`.
 * 
 * @param {string} productID - The ID of the product to update.
 * 
 * @param {Object} productData - The product data to update. This object must include at least one of the following fields:
 *   - `name` (string): The name of the product.
 *   - `price` (number): The price of the product.
 *   - `thumbnail` (string): The URL of the product's thumbnail image.
 *   - `details` (string): A description of the product.
 *   - `category` (string): The category ID of the product.
 *   - `collection` (string): The collection ID to which the product belongs.
 * 
 * @returns {Promise<Object>} A promise that resolves with the updated product data if successful, or an error if the request fails.
 * 
 * @example
 * const updatedProductData1 = {
 *   price: 24.99,
 *   details: "A high-quality cotton t-shirt that is comfortable and durable."
 * };
 * 
 * updateProduct("12345", updatedProductData1)
 *   .then(response => {
 *     console.log("Product updated successfully:", response);
 *   })
 *   .catch(error => {
 *     console.error("Error updating product:", error);
 *   });
 * 
 * @example
 * // Example 2: Updating a product's category and collection
 * const updatedProductData2 = {
 *   category: "MEN_TOP_TS",
 *   collection: "ER"
 * };
 * 
 * updateProduct("67890", updatedProductData2)
 *   .then(response => {
 *     console.log("Product updated successfully:", response);
 *   })
 *   .catch(error => {
 *     console.error("Error updating product:", error);
 *   });
 */
export const updateProduct = (productID, productData) => {
    return ApiMethods.put(PRODUCT_ENDPOINTS.ADMIN_PRODUCT_ROUTE(productID), productData)
};

/**
 * Deletes a product from the system based on the provided product ID.
 * 
 * @param {string} productID - The ID of the product to delete.
 * 
 * @returns {Promise<Object>} A promise that resolves with the response from the API call,
 *                            indicating the success or failure of the deletion operation.
 * 
 * @example
 * // Example usage of the deleteProduct function:
 * deleteProduct("12345")
 *   .then(response => {
 *     console.log("Product deleted successfully:", response);
 *   })
 *   .catch(error => {
 *     console.error("Error deleting product:", error);
 *   });
 */
export const deleteProduct = (productID) => {
    return ApiMethods.delete(PRODUCT_ENDPOINTS.ADMIN_PRODUCT_ROUTE(productID));
}

export const addVariant = (productID, color, image) => {
    return ApiMethods.post(PRODUCT_ENDPOINTS.ADMIN_VARIANT_ROUTE(productID),{color, image})
}

export const updateVariant = (productID, color, image) => {
    return ApiMethods.put(PRODUCT_ENDPOINTS.ADMIN_VARIANT_ROUTE(productID), {color, image} )
}

export const deleteVariant = (productID, variant) => {
    return ApiMethods.delete(PRODUCT_ENDPOINTS.ADMIN_VARIANT_ROUTE(productID, variant))
}

export const addSize = (productID, size) => {
    return ApiMethods.patch(PRODUCT_ENDPOINTS.ADMIN_SIZE_ROUTE(productID, size))
}

export const deleteSize = (productID = "", size) => {
    return ApiMethods.delete(PRODUCT_ENDPOINTS.ADMIN_SIZE_ROUTE(productID, size))
}
