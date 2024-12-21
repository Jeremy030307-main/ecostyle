// Import the Firebase Admin SDK
import admin from 'firebase-admin';

// authenticate that the user has an account and currently log in
const authenticate = async (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

    const token = authHeader.split(' ')[1]; // Split "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing in Authorization header' });
      }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

    const token = authHeader.split(' ')[1]; // Split "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing in Authorization header' });
      }

    try {
        const claims = await admin.auth().verifyIdToken(token);
        if (claims.admin !== true){
            return res.status(401).send("Permission Denied")
        } 
        req.user = claims;
        next()

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
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