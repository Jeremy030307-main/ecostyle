import { ApiMethods } from "../ApiMethods";
import ADDRESS_ENDPOINTS from "../endpoints/addressEndpoint";
import useSEE from "../useSEE";

/**
 * Custom hook to fetch and listen to real-time updates for the user's address data.
 *
 * This hook uses Server-Sent Events (SSE) to connect to the backend endpoint and listen for any changes 
 * to the user's address data in real-time. It returns the latest address data as received from the server.
 *
 * @returns {Object|null} The user's address data, or null if no data is available.
 *
 * @example
 * const userAddress = useUserAddress();
 * console.log(userAddress); // Logs the current user's address data in real-time
 */
export const getUserAddress = () => {
    return ApiMethods.get(ADDRESS_ENDPOINTS.ADDRESS_ROUTE());
}

/**
 * Adds a new address for the user.
 * 
 * @param {string} addressName - The name of the address.
 * @param {string} firstName - The first name of the person associated with the address.
 * @param {string} lastName - The last name of the person associated with the address.
 * @param {string} address - The street address.
 * @param {string} city - The city of the address.
 * @param {string} state - The state of the address.
 * @param {string} postalCode - The postal code of the address.
 * @param {string} phone - The phone number associated with the address.
 * 
 * @returns {Promise} A Promise that resolves to the response of the POST request to add the address.
 */
export const addNewAddress = (addressName, name, line1, line2, city, state, postalCode, country, phone) => {
    // Create an object with the required fields first
    const data = {
        addressName,
        name,
        line1,
        city,
        state,
        postalCode,
        country
    };

    // Conditionally add line2 if it's not null or undefined
    if (line2 !== null && line2 !== undefined && line2 !== "") {
        data.line2 = line2;
    }

    // Conditionally add phone if it's not null or undefined
    if (phone !== null && phone !== undefined && phone !== "") {
        data.phone = phone;
    }

    console.log(data)

    // Make the API call
    return ApiMethods.post(ADDRESS_ENDPOINTS.ADDRESS_ROUTE(), data);
}

/**
 * Edits an existing address.
 * 
 * @param {string} addressID - The ID of the address to be edited.
 * @param {string} addressName - The name of the address.
 * @param {string} firstName - The first name of the person associated with the address.
 * @param {string} lastName - The last name of the person associated with the address.
 * @param {string} address - The street address.
 * @param {string} city - The city of the address.
 * @param {string} state - The state of the address.
 * @param {string} postalCode - The postal code of the address.
 * @param {string} phone - The phone number associated with the address.
 * 
 * @returns {Promise} A Promise that resolves to the response of the PUT request to edit the address.
 */
export const editAddress = (addressID, addressName, name, line1, line2, city, state, postalCode, country, phone) => {
    // Create an object with the required fields first
    console.log("Editting")
    const data = {
        addressName,
        name,
        line1,
        city,
        state,
        postalCode,
        country
    };

    // Conditionally add line2 if it's not null or undefined
    if (line2 !== null && line2 !== undefined && line2 !== "") {
        data.line2 = line2;
    }

    // Conditionally add phone if it's not null or undefined
    if (phone !== null && phone !== undefined && phone !== "") {
        data.phone = phone;
    }

    return ApiMethods.put(ADDRESS_ENDPOINTS.ADDRESS_ROUTE(addressID), data)
}

/**
 * Deletes an existing address.
 * 
 * @param {string} addressID - The ID of the address to be deleted.
 * 
 * @returns {Promise} A Promise that resolves to the response of the DELETE request to delete the address.
 */
export const deleteAddress = (addressID) => {
    return ApiMethods.delete(ADDRESS_ENDPOINTS.ADDRESS_ROUTE(addressID));
}
