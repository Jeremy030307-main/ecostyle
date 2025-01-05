import AuthenticationManager from "../../authentication/authenticationManager";
import { ApiMethods } from "../ApiMethods";
import USER_ENDPOINTS from "../endpoints/userEndpoint";

/**
 * Fetches the details of the currently authenticated user.
 * 
 * This function calls the API to retrieve the data associated with the currently authenticated user.
 * It assumes that the user is logged in and retrieves their `uid` from the `AuthenticationManager`.
 * 
 * @returns {Promise<Object>} The user data returned by the API.
 * @throws {Error} If there is no authenticated user.
 */
export const getUser = () => {
    return ApiMethods.get(USER_ENDPOINTS.USER_ROUTE());
}

/**
 * Creates a new user with the specified details.
 * 
 * This function sends a POST request to the API to create a new user. It assumes the currently authenticated user
 * is submitting the data on behalf of another user (or themselves).
 * 
 * @param {string} fname - The first name of the user.
 * @param {string} lname - The last name of the user.
 * @param {string} email - The email address of the user.
 * 
 * @returns {Promise<Object>} The response from the API after creating the user.
 * @throws {Error} If there is no authenticated user.
 */
export const createUser = (fname, lname, email) => {

    const currentUser = AuthenticationManager.getCurrentUser();

    const body = {
        firstName: fname,
        lastName: lname,
        email: email
    };

    return ApiMethods.post(USER_ENDPOINTS.USER_ROUTE(currentUser.uid), body);
};

/**
 * Updates the details of the currently authenticated user.
 * 
 * This function sends a PATCH request to update the details (first name, last name, and/or email) of the currently
 * authenticated user. It will only update the fields that are provided and are not null/undefined.
 * 
 * @param {string|null} fname - The new first name of the user. If not provided, it will not be updated.
 * @param {string|null} lname - The new last name of the user. If not provided, it will not be updated.
 * @param {string|null} email - The new email of the user. If not provided, it will not be updated.
 * 
 * @returns {Promise<Object>} The response from the API after updating the user data.
 * @throws {Error} If there is no authenticated user.
 */
export const updateUser = (name = null, phone=null) => {

    const body = {phone};

    if (name !== null && name !== undefined && name !== "") {
        body.name = name;
    }

    return ApiMethods.put(USER_ENDPOINTS.USER_ROUTE(), body)
}



/**
 * Deletes the currently authenticated user.
 * 
 * This function sends a DELETE request to the API to remove the currently authenticated user's data.
 * It assumes that the user is authenticated before the API call is made.
 * 
 * @returns {Promise<Object>} The response from the API after deleting the user.
 * @throws {Error} If there is no authenticated user.
 */
export const deleteUser = () => {
    const currentUser = AuthenticationManager.getCurrentUser();

    return ApiMethods.delete(USER_ENDPOINTS.USER_ROUTE(currentUser.uid))

}

/**
 * Sets the currently authenticated user as an admin.
 * 
 * This function sends a PATCH request to update the role of the currently authenticated user to "admin".
 * It assumes that the user is authenticated before making the request.
 * 
 * @returns {Promise<Object>} The response from the API after updating the user role.
 * @throws {Error} If there is no authenticated user.
 */
export const setAdmin = () => {

    const currentUser = AuthenticationManager.getCurrentUser();

    if (!currentUser) {
        throw new Error("No authenticated user found");
    }

    return ApiMethods.patch(USER_ENDPOINTS.ADMIN_USER_ROUTE(currentUser.uid), {})
}