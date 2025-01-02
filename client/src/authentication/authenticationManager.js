import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInAnonymously, updateProfile, EmailAuthCredential, EmailAuthProvider, linkWithCredential, GithubAuthProvider } from "firebase/auth";
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

    static signInAnonymously = async () => {
        try {
            await signInAnonymously(this.auth);
            console.log("Signed in anonymously");
        } catch (error) {
            console.error("Anonymous sign-in failed:", error.code, error.message);
        }
    };

    static signUp = async(fname, lname, email, password) => {

        try {
            const credential = EmailAuthProvider.credential(email, password);
            const currentUser = this.auth.currentUser;

            if (!currentUser || !currentUser.isAnonymous) {
                console.log(currentUser)
                throw new Error("No anonymous user available to upgrade.");
            }

            // Link the anonymous account with the email/password credential
            const userCredential = await linkWithCredential(currentUser, credential);
            await updateProfile(userCredential.user, {
                displayName: `${fname} ${lname}`,
            });
            console.log("User sign-up successful:", userCredential.user.displayName);
            return userCredential.user; // Return the user object for further use.
        } catch (error) {
            throw new Error("User sign-up failed:")
        }
    }

    static signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log("User sign-in successful:", userCredential.user.displayName);
            return userCredential.user; // Return the user object for further use.
        } catch (error) {
            throw new Error("User sign-in failed:")
        }
    };

    static signOut = async() => {

        try{
            await signOut(this.auth)
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
        await ApiMethods.post("/user/set-cookie", {token : token})
    } else {
        await AuthenticationManager.signInAnonymously();
    }
});

export default AuthenticationManager;