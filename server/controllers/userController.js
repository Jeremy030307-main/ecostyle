import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword ,
    signOut
} from "firebase/auth";


const auth = getAuth();

// sign up with email and password
export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Wait for the user creation to complete
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Extract user info from the created userCredential
        const user = userCredential.user;
        
        const idToken = await user.getIdToken(); // Or verify the token

        // Send a success response after the user is created
        res.status(200).json({
        message: "Login successful",
        idToken: idToken,
        user: {
            uid: user.uid,
            email: user.email,
        },
        });

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};

// sign in
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Wait for the user sign in to complete
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Extract user info from the created userCredential
        const user = userCredential.user;
        
        const idToken = await user.getIdToken(); // Or verify the token

        // Send a success response after the user is created
        res.status(200).json({
        message: "Login successful",
        idToken: idToken,
        user: {
            uid: user.uid,
            email: user.email,
        },
        });

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};

// sign out
export const userSignOut = async (req, res, next) => {
    try {
        
        // Wait for the user sign out to complete
        await signOut(auth);

        // Send a success response after the user is created
        res.status(200).send("Sign Out Successfully")

      } catch (error) {
        // Send error response if there is any
        res.status(400).send(error.message);
      }
};
