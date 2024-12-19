const COLLECTION_ENDPOINTS = {
  
    COLLECTION: (collectionID = "") => `/collection/${collectionID}`,
    ADMIN_COLLECTION:  (collectionID = "") => `admin/collection/${collectionID}`,
    COLLECTION_STATUS: (collectionID = "", status) => `admin/collection/${collectionID}/${status}`,

}

export default COLLECTION_ENDPOINTS;