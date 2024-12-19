import { ApiMethods } from "../ApiMethods";
import CATEGORY_ENDPOINTS from "../endpoints/categoryEndpoint";

/**
 * Fetches the category details based on the provided category ID.
 * The returned data can either be a single category or an array of categories, 
 * each containing a list of subcategories.
 *
 * @param {string} [categoryID=""] - The ID of the category to fetch. If empty, fetches all categories.
 * 
 * @returns {Promise<Object|Array>} A promise that resolves with the category data. The data returned could be:
 * 
 * - A single category object with the following structure:
 *   {
 *     id: string,           // The unique identifier for the category (e.g., "MEN", "WMN")
 *     name: string,         // The name of the category (e.g., "Men", "Women")
 *     subcategories: [      // Optional: Array of subcategories under this category
 *       {
 *         id: string,       // The unique identifier for the subcategory (e.g., "MEN_BOT", "MEN_TOP")
 *         name: string,     // The name of the subcategory (e.g., "Bottoms", "Tops")
 *         subcategories: [  // Optional: Nested array of subcategories
 *           {
 *             id: string,   // The unique identifier for the nested subcategory (e.g., "MEN_BOT_HS")
 *             name: string  // The name of the nested subcategory (e.g., "Pants")
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * 
 * - An array of category objects, each containing the same structure as above.
 */
export const getCategory = (categoryID = "") => {
    return ApiMethods.get(CATEGORY_ENDPOINTS.CATEGORY_ROUTE(categoryID))
};

/**
 * Creates a new category.
 * 
 * @param {Object} categoryData - The data to create the category.
 * @param {string} categoryData.id - The unique identifier for the category.
 * @param {string} categoryData.name - The name of the category.
 * @param {Array<Object>} [categoryData.subcategories] - Optional array of subcategories for this category.
 * Each element in the `subcategories` array should be of the same structure as `categoryData`.
 *   Each subcategory object should have:
 *   - `id` (string) - The unique identifier for the subcategory.
 *   - `name` (string) - The name of the subcategory.
 * @param {string} [parentCategoryID=""] - The ID of the parent category, if applicable.
 * 
 * @returns {Promise<any>} The API response.
 */
export const createCategory = (categoryData, parentCategoryID = "") => {
    return ApiMethods.post(CATEGORY_ENDPOINTS.ADMIN_CATEGORY_ROUTE(parentCategoryID), categoryData)
};

/**
 * Deletes a category by its ID.
 * 
 * @param {string} categoryID - The unique identifier of the category to delete.
 * @returns {Promise<Object>} A promise that resolves to the response from the API call.
 */
export const deleteCategory = (categoryID) => {
    return ApiMethods.delete(CATEGORY_ENDPOINTS.ADMIN_CATEGORY_ROUTE(categoryID))
};

