import { ApiMethods } from "../ApiMethods";
import COLLECTION_ENDPOINTS from "../endpoints/collectionEndpoint";

/**
 * Fetches the active collections (status = active) details based on the provided collection ID.
 * The returned data can either be a single category or an array of categories, 
 * each containing a list of subcategories.
 *
 * @param {string} [collectionID=""] - The ID of the collection to fetch. If empty, fetches all active collections.
 * 
 * @returns {Promise<Object|Array>} A promise that resolves with the category data. The data returned could be:
 * 
 * - A single category object with the following structure:
 *   {
 *     id: string,           // The unique identifier for the collection (e.g., "ER")
 *     name: string,         // The name of the collection
 *     description: string.  // The description of the colleciton
 *   }
 * 
 * - An array of category objects, each containing the same structure as above.
 */
export const getActiveCollection = (collectionID = "") => {
    return ApiMethods.get(COLLECTION_ENDPOINTS.COLLECTION(collectionID))
}

/**
 * Fetches the collection data based on the provided collection ID.
 * If the collection ID is provided, the data will include `statusHistory`; 
 * if no collection ID is provided, the data will be an array of collections without `statusHistory`.
 * 
 * @param {string} [collectionID=""] - The ID of the collection to fetch. If empty, fetches all collections.
 * 
 * @returns {Promise<Object|Array>} A promise that resolves with the collection data. The data returned could be:
 * 
 * - **If `collectionID` is provided**: A single collection object with the following structure:
 *   ```javascript
 *   {
 *     id: string,           // The unique identifier for the collection (e.g., "ER")
 *     name: string,         // The name of the collection (e.g., "Eo Root")
 *     status: string,       // The current status of the collection (e.g., "new")
 *     createdAt: string,    // The creation date of the collection in ISO 8601 format (e.g., "2024-12-15T16:28:16.111Z")
 *     description: string,  // The description of the collection (e.g., "Introducing the Eo Roots Collection...")
 *     statusHistory: [      // Optional: History of the collection status changes
 *       {
 *         status: string,   // The status at the given time (e.g., "new")
 *         updatedAt: string // The timestamp when the status was last updated in ISO 8601 format (e.g., "2024-12-15T16:28:16.114Z")
 *       }
 *     ]
 *   }
 *   ```
 * 
 * - **If no `collectionID` is provided**: An array of collection objects, each containing the following structure:
 *   ```javascript
 *   {
 *     id: string,           // The unique identifier for the collection (e.g., "ER")
 *     name: string,         // The name of the collection (e.g., "Eo Root")
 *     status: string,       // The current status of the collection (e.g., "new")
 *     createdAt: string,    // The creation date of the collection in ISO 8601 format (e.g., "2024-12-15T16:28:16.111Z")
 *     description: string   // The description of the collection (e.g., "Introducing the Eo Roots Collection...")
 *   }
 *   ```
 */
export const getAllCollection = (collectionID = "") => {
    return ApiMethods.get(COLLECTION_ENDPOINTS.ADMIN_COLLECTION(collectionID))
}

/**
 * Adds a new collection with the given details.
 *
 * @param {string} id - The unique id for the collection.
 * @param {string} name - The name of the collection.
 * @param {string} description - The description of the collection.
 * @returns {Promise} - A promise that resolves to the API response after the collection is created.
 *
 * @example
 * // Adding a new collection
 * addNewCollection("C001", "Summer Collection", "A collection of summer-themed products", "http://example.com/thumbnail.jpg")
 *   .then(response => {
 *     console.log("New collection added:", response.data);
 *   })
 *   .catch(error => {
 *     console.error("Error:", error);
 *   });
 */
export const addCollection = (id, name, description) => {
    const body = {
        id: id, 
        name: name, 
        description: description,
    }
    return ApiMethods.post(COLLECTION_ENDPOINTS.ADMIN_COLLECTION(), body)
}

/**
 * Updates an existing collection with the given collectionID. Optionally, update the description and/or thumbnail.
 *
 * @param {string} collectionID - The ID of the collection to update.
 * @param {string} [description=""] - The new description for the collection (optional).
 * @param {string} [thumbnail=""] - The new thumbnail URL for the collection (optional).
 * @returns {Promise} - A promise that resolves to the API response confirming the update.
 *
 * @example
 * // Update a collection by ID with a new description
 * updateCollection("12345", "Updated description", "http://example.com/new-thumbnail.jpg")
 *   .then(response => {
 *     console.log("Collection updated:", response.data);
 *   })
 *   .catch(error => {
 *     console.error("Error:", error);
 *   });
 *
 * @example
 * // Update only the description of the collection
 * updateCollection("12345", "New collection description")
 *   .then(response => {
 *     console.log("Collection updated:", response.data);
 *   })
 *   .catch(error => {
 *     console.error("Error:", error);
 *   });
 */
export const updateCollection = (collectionID, description = "") => {
    const body = {}

    if (description !== ""){
        body.description = description
    }

    return ApiMethods.patch(COLLECTION_ENDPOINTS.ADMIN_COLLECTION(collectionID), body)
}

/**
 * Sets the state (status) of the collection specified by collectionID.
 *
 * @param {string} collectionID - The ID of the collection to update.
 * @param {string} status - The new status to set for the collection (e.g., "active", "inactive").
 * @returns {Promise} - A promise that resolves to the API response confirming the update.
 *
 * @example
 * // Set the status of a collection to "inactive"
 * setCollectionState("12345", "inactive")
 *   .then(response => {
 *     console.log("Collection status updated:", response.data);
 *   })
 *   .catch(error => {
 *     console.error("Error:", error);
 *   });
 */
export const setCollectionState = (collectionID, status) => {
    return ApiMethods.patch(COLLECTION_ENDPOINTS.COLLECTION_STATUS(collectionID, status), {})
}

/**
 * Deletes the collection specified by collectionID.
 *
 * @param {string} collectionID - The ID of the collection to delete.
 * @returns {Promise} - A promise that resolves to the API response confirming the deletion.
 *
 * @example
 * // Delete a collection by ID
 * deleteCollection("12345")
 *   .then(response => {
 *     console.log("Collection deleted:", response.data);
 *   })
 *   .catch(error => {
 *     console.error("Error:", error);
 *   });
 */
export const deleteCollection = (collectionID) => {
    return ApiMethods.delete(COLLECTION_ENDPOINTS.ADMIN_COLLECTION(collectionID))
};


