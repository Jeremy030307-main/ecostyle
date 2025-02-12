import { ApiMethods } from "../ApiMethods";
import CATEGORY_ENDPOINTS from "../endpoints/categoryEndpoint";

/**
 * Fetches all categories or a specific category by ID.
 * If no ID is provided, it fetches all categories.
 *
 * @param {string} [categoryID=""] - The category ID (optional).
 * @returns {Promise<Object|Array>} The category data.
 */
export const getCategory = (categoryID = "") => {
    return ApiMethods.get(CATEGORY_ENDPOINTS.CATEGORY_ROUTE(categoryID));
};

/**
 * Fetches the size guide for a specific category.
 *
 * @param {string} categoryID - The ID of the category.
 * @returns {Promise<Array>} The size guide array.
 */
export const getSizeGuide = async (categoryID) => {
    try {
        const response = await ApiMethods.get(CATEGORY_ENDPOINTS.CATEGORY_ROUTE(categoryID));
        return response.data.size_guide || [];
    } catch (error) {
        console.error(`Error fetching size guide for category ${categoryID}:`, error);
        throw error;
    }
};

/**
 * Updates the size guide for a specific category.
 *
 * @param {string} categoryID - The category ID.
 * @param {Array<Object>} sizeGuide - The updated size guide array.
 * @returns {Promise<any>} API response.
 */
export const updateSizeGuide = (categoryID, sizeGuide) => {
    return ApiMethods.put(CATEGORY_ENDPOINTS.ADMIN_CATEGORY_ROUTE(categoryID), { size_guide: sizeGuide });
};
