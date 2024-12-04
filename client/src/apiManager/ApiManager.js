import ENDPOINTS from "./EndPoint";
import { GET, POST } from "./ApiMethods";

class ApiManager {

    // static signUp = (email, password) => {
    //     const body = {
    //         email: {email},
    //         password: {password}
    //     } ;


    //     return ApiMethods.post(ENDPOINTS.SIGN_UP, body);
    // };

    static getProducts = () => {

        return GET(ENDPOINTS.GET_PRODUCTS);
    };

}

export default ApiManager