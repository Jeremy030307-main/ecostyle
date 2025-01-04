export const COLLECTIONS = {
    PRODUCT: 'product',
    STOCK: 'stock',
    COLOR: 'color',
    CATEGORY: 'category',
    SUBCATEGORY: 'subcategory',
    COLLECTION: 'collection',
    COLLECTION_HISTROY: "history",
    USER: "user",
    REVIEW: "review",
    CART: "cart",
    ADDRESS: "address",
    ORDER: "order"
};
  
 
function convertFirestoreTimestampToISO(firestoreTimestamp) {
    if (!firestoreTimestamp || !firestoreTimestamp._seconds) {
        throw new Error("Invalid Firestore Timestamp format");
    }

    // Convert seconds to milliseconds and add nanoseconds as fractional milliseconds
    const milliseconds = (firestoreTimestamp._seconds * 1000) + Math.floor(firestoreTimestamp._nanoseconds / 1e6);

    // Create a Date object and convert to ISO 8601 format
    return new Date(milliseconds).toISOString();
}

export function formatFirestoreTimestamps(data) {
    const formattedData = { ...data };

    // Check and format the createdAt field
    if (formattedData.createdAt && formattedData.createdAt._seconds !== undefined) {
        formattedData.createdAt = convertFirestoreTimestampToISO(formattedData.createdAt);
    }

    // Check and format the updatedAt field
    if (formattedData.updatedAt && formattedData.updatedAt._seconds !== undefined) {
        formattedData.updatedAt = convertFirestoreTimestampToISO(formattedData.updatedAt);
    }

    return formattedData;
}

export const message = (message) => ({ error: message });