import { ApiMethods } from '../apiManager/ApiMethods'; 

class AuthenticationManager {
    
    static signUp = async(fname, lname, email, password) => {

        // const { login } = useAuth();
        const body = {
            firstName: fname,
            lastName: lname,
            email: email,
            password: password
        };

        let tokenID = null

        try {
            const response = await ApiMethods.post("/user/signUp", body);
            tokenID = response;
            return tokenID
        } catch (error) {
            console.log('error', error)
            return tokenID
        }
    }

    static signIn = async (email, password) => {

        const body = {
            email: email,
            password: password
        }
        let signInToken = null

        try {
            const response = await ApiMethods.post("/user/signIn", body);
            signInToken = response;
            return signInToken
        } catch (error) {
            console.log('error', error)
            return signInToken
        }
    };

    static signOut = async() => {

        try {
            await ApiMethods.delete("/user/signOut")
        } catch (error) {
            console.log("error", error)
        }
    }

    static getUser = async(id) => {

        let user = null
        try {
            user = await ApiMethods.get(`/user/${id}`)
        } catch (error) {
            console.log('error', error)
        }

        return user
    }
}

export default AuthenticationManager