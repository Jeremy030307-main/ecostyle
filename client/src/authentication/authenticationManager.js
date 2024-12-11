// import { ApiMethods } from '../apiManager/ApiMethods'; 

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
                return true
            })
            .catch((error) => {
                console.log("User failed to sign in.")
                return false
            });
    }

    static signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log("User Sign In Successful");
            return true; // Return true on success
        } catch (error) {
            console.log("User failed to sign in:", error.message);
            return false; // Return false on failure
        }
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

export default AuthenticationManager;