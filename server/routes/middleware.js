// Import the Firebase Admin SDK
import admin from 'firebase-admin';
import { message } from '../controllers/utility.js';

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {
  // Extract the token from cookies
  const token = req.cookies.authToken;  // Assuming the token is stored in the 'authToken' cookie

  // If token is missing, return an error
  if (!token) {
      return res.status(401).send(message('Token missing in cookies'));
  }

  try {
    console.log("Authenticating with token from cookies");

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if the user is anonymous (optional)
    if (decodedToken.firebase.sign_in_provider === 'anonymous') {
        return res.status(401).send(message("User must be authenticated for this action."));
    }
    
    // Attach the decoded token (user information) to the request object
    req.user = decodedToken.uid;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, respond with an error
    res.status(401).json(message("Permission Denied"));
  }
};

const isAdmin = async (req, res, next) => {

    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).send(message('Token missing in cookies'));
      }

    try {
        const claims = await admin.auth().verifyIdToken(token);
        if (claims.admin !== true){
            return res.status(401).send(message("Permission Denied"))
        } 
        req.user = claims.uid;
        next()

    } catch (err) {
        res.status(401).json(message("Permission Denied"));
    }
};

const validateRequest = (schema, ...args) => async (req, res, next) => {

  const { error, value } = await schema.validate(req.body);
    
  if (error) {
    // Return a list of validation errors
    return res.status(400).send(error.details.map(e => e.message));
  }

  const results = await Promise.all(
    args.map(async (fn) => {
      const result = await fn(req.body);
      return result;  // Return both the validation status and any potential error message
    })
  );

  // Extract error messages for any failed validations
  const errorMessages = results.filter(result => !result.isValid).map(result => result.errorMessage);

  // If any validations failed, return the error messages
  if (errorMessages.length > 0) {
    return res.status(400).send(errorMessages);
  }

  next();
};

export { authenticate, isAdmin, validateRequest }