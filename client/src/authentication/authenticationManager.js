import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, signInAnonymously, updateProfile, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { ApiMethods } from "../apiManager/ApiMethods";
import { createUser } from '../apiManager/methods/userMethods';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

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

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const auth = getAuth(app);

    const [isAuthenticated, setAuthentication] = useState(false);
    const [uid, setUid] = useState(null)
    const [isAdmin, setAdmin] = useState(false);
    const refreshTokenTimeout = useRef(null); // Reference to store the timeout ID


    const handleAnonymousSignIn = useCallback(async () => {
        try {
            if (!auth.currentUser) {
                await signInAnonymously(auth);
                console.log("Signed in anonymously");
            }
        } catch (error) {
            console.error("Anonymous sign-in failed:", error.code, error.message);
        }
    }, [auth]);

    useEffect(() => {

        const handleTokenAndSetCookie = async (user) => {
            try {
                const token = await user.getIdToken();
                console.log("User Logged In", token);
    
                await ApiMethods.post("/user/set-cookie", { token });
                scheduleTokenRefresh(user); // Schedule the token refresh
            } catch (error) {
                console.error("Error setting cookie:", error.message);
            }
        };

        const scheduleTokenRefresh = (user) => {
            clearRefreshTokenTimeout(); // Clear any existing timeout
    
            // Refresh the token ~5 minutes before it expires (default token expiry is 1 hour)
            const refreshInterval = 55 * 60 * 1000; // 55 minutes in milliseconds
            refreshTokenTimeout.current = setTimeout(async () => {
                try {
                    const refreshedToken = await user.getIdToken(true); // Force refresh the token
                    console.log("Token refreshed", refreshedToken);
    
                    await ApiMethods.post("/user/set-cookie", { token: refreshedToken });
                    scheduleTokenRefresh(user); // Schedule the next refresh
                } catch (error) {
                    console.error("Error refreshing token:", error.message);
                }
            }, refreshInterval);
        };
    
        const clearRefreshTokenTimeout = () => {
            if (refreshTokenTimeout.current) {
                clearTimeout(refreshTokenTimeout.current);
                refreshTokenTimeout.current = null;
            }
        };

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("Anomynous User", user.isAnonymous)
                try {
                    await handleTokenAndSetCookie(user);
                    setUid(user.uid)
                    setAuthentication(!user.isAnonymous);
                    auth.currentUser
                        .getIdTokenResult()
                        .then((idTokenResult) => {
                        setAdmin(Boolean(idTokenResult.claims.admin));
                        })
                        .catch(() => setAdmin(false)); // Handle error gracefully
                } catch (error) {
                    console.error("Error during token processing:", error.message);
                }
            } else {
                // Sign in anonymously if no user
                await handleAnonymousSignIn();
                setAuthentication(false);
            }
        });

        // Cleanup listener on component unmount
        return () => {
            unsubscribe();
            clearRefreshTokenTimeout();
        };
    }, [auth, handleAnonymousSignIn]);

    const signUp = useCallback(async (fname, lname, email, password) => {
        try {
            const credential = EmailAuthProvider.credential(email, password);
            const currentUser = auth.currentUser;

            if (!currentUser || !currentUser.isAnonymous) {
                throw new Error("No anonymous user available to upgrade.");
            }

            const userCredential = await linkWithCredential(currentUser, credential);
            await updateProfile(userCredential.user, {
                displayName: `${fname} ${lname}`,
            });

            console.log("User sign-up successful:", userCredential.user.displayName);

            await createUser(fname, lname, email); // Assuming this is your API call for user creation
            setAuthentication(true) 
            return userCredential.user;
        } catch (error) {
            setAuthentication(false) 
            console.error("User sign-up failed:", error.message);
            throw error; // Allow upstream handling
        }
    }, [auth.currentUser]);

    const signIn = useCallback(async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User sign-in successful:", userCredential.user.displayName);
            setAuthentication(true) 
            return userCredential.user;
        } catch (error) {
            setAuthentication(false) 
            console.error("User sign-in failed:", error.message);
            throw error;
        }
    }, [auth]);

    const userSignOut = useCallback(async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            setAuthentication(false);
            return true;
        } catch (error) {
            console.error("User sign-out failed:", error.message);
            return false;
        }
    }, [auth]);

    // Context value
    const value = {
        auth,
        uid,
        isAuthenticated,
        isAdmin,
        signUp,
        signIn,
        userSignOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};