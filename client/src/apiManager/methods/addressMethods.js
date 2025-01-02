import { ApiMethods } from "../ApiMethods";
import ADDRESS_ENDPOINTS from "../endpoints/addressEndpoint";

/**
 * Fetches the list of user addresses.
 * 
 * @returns {Promise} A Promise that resolves to the response of the GET request to the address endpoint.
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
export const addNewAddress = (addressName, firstName, lastName, address, city, state, postalCode, phone) => {
    const data = {
        addressName, firstName, lastName, address, city, state, postalCode, phone
    }
    return ApiMethods.post(ADDRESS_ENDPOINTS.ADDRESS_ROUTE(), data)
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
export const editAddress = (addressID, addressName, firstName, lastName, address, city, state, postalCode, phone) => {
    const data = {
        addressName, firstName, lastName, address, city, state, postalCode, phone
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
