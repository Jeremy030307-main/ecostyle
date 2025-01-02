import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInAnonymously } from "firebase/auth";
import { ApiMethods } from "../apiManager/ApiMethods";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDblWMU63OZ7WPafTuNrIW30BVwChM7JOI",
    authDomain: "ecostyle-f6ae5.firebaseapp.com",
    projectId: "ecostyle-f6ae5",
    storageBucket: "ecostyle-f6ae5.firebasestorage.app",
    messagingSenderId: "366491565308",
    appId: "1:366491565308:web:cbffe5fa3ebd46a36beb79"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class AuthenticationManager {

    static auth = getAuth(app);

    static signUp = async(fname, lname, email, password) => {

        createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                // Signed up 
                console.log("User sign up successful")
            })
            .catch((error) => {
                console.log("User failed to sign in.")
            });
    }

    static signIn = async (email, password) => {
        signInWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User sign up successful")
            })
            .catch((error) => {
                console.log("User failed to sign in.")
            });
    };

    static signOut = async() => {

        try{
            const logout = await signOut(this.auth)
            console.log("User Sign Out")
            return true
        } catch (error) {
            // An error happened.
            console.log("User sign out fail", error)
            return false
        }
    }
    
}

AuthenticationManager.auth.onAuthStateChanged(async (user) => {

    if (user){
        const token = await user.getIdToken();
        console.log("user")
        await ApiMethods.post("/user/set-cookie", {token : token})
    } else {
        console.log("anomynous")
        signInAnonymously(AuthenticationManager.auth)
            .then(() => {
                console.log("Anomynously")
            })
            .catch((error) => {
                console.log("Sign In Anomynously Fail")
            });
    }
    

});

export default AuthenticationManager;