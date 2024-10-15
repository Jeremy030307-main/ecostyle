import { DELETE, POST } from "../apiManager/ApiMethods";
import AUTH_ENDPOINTS from "./authEndpoint";
import { ApiMethods } from '../apiManager/ApiMethods'; 

class AuthenticationManager {
    
    static signUp = async(email, password) => {

        // const { login } = useAuth();
        const body = {
            email: email,
            password: password
        };

        let tokenID = null

        try {
            const response = await ApiMethods.post("/user/signUp", body);
            tokenID = response.idToken;
        } catch (error) {
            console.log('error', error)
        }

        return tokenID
    }

    static signIn = async (email, password) => {

        const body = {
            email: '123456@gmail.com',
            password: "userpassword123"
        }
        let tokenID = null

        try {
            const response = await ApiMethods.post("/user/signIn", body);
            tokenID = response.idToken;
        } catch (error) {
            console.log('error', error)
        }

        return tokenID
    };

    static signOut = async() => {

        try {
            await ApiMethods.delete("/user/signOut")
        } catch (error) {
            console.log("error", error)
        }
    }
}

export default AuthenticationManager