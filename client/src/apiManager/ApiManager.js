import { ApiMethods } from "./ApiMethods";
import ENDPOINTS from "./EndPoint";

class ApiManager {

    static signUp = (fname, lname, email, password) => {

        const body = {
            firstName: fname,
            lastName: lname,
            email: email,
            password: password
        };

        return ApiMethods.post(ENDPOINTS.SIGN_UP, body);

    };

    static signIn = (email, password) => {

        const body = {
            email: email,
            password: password
        }

        return ApiMethods.post(ENDPOINTS.SIGN_IN, body);
    }

    static signOut = () => {
        return ApiMethods.delete(ENDPOINTS.SIGN_OUT);
    }

    static getUser = (userID) => {
        return ApiMethods.get(ENDPOINTS.GET_USER(userID));
    }

}

export default ApiManager