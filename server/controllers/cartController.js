import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js";

export const getUserCart = (req, res) => {
  const userId = req.user;

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Content-Encoding', "none");
  res.flushHeaders(); // Flush headers to establish SSE connection

  try {
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);

    // Set up a Firestore snapshot listener for real-time updates
    const unsubscribe = userCartRef.onSnapshot(
      (snapshot) => {
        const cart = snapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID for reference
          ...doc.data(),
        }));

        // Send the updated cart data to the client
        res.write(`data: ${JSON.stringify(cart)}\n\n`);
      },
      (error) => {
        console.error("Error listening to user cart changes:", error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      }
    );

    // Handle connection close and clean up the listener
    req.on('close', () => {
      unsubscribe(); // Stop listening for changes
      res.end();
    });
  } catch (error) {
    console.error("Error setting up cart listener:", error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

// Add a product to the user's cart
export const addProductToCart = async (req, res) => {
  const userId = req.user;
  const { product, quantity } = req.body;

  try {
    console.log(req.user, userId)
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);
    const productRef = userCartRef.doc(product);

    const productDoc = await productRef.get();

    if (productDoc.exists) {
      return res.status(400).send(message("Product already in cart."))
    }
    // Add a new product to the cart
    await productRef.set({
    product,
    quantity,
    }); 

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Update the quantity of a product in the user's cart
export const updateCartProductQuantity = async (req, res) => {
  const userId = req.user;
  const { product, quantity } = req.body;

  try {
    const productRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART).doc(product);

    const productDoc = await productRef.get();

    if (productDoc.exists) {
      await productRef.update({ quantity });
      return res.status(200).json({ message: 'Cart product quantity updated successfully' });
    } else {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product quantity' });
  }
};

// Remove a product from the user's cart
export const removeCartProduct = async (req, res) => {
  const userId = req.user;
  const product = req.params.productId;

  try {
    const productRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART).doc(product);

    await productRef.delete();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};

// Clear all products from the user's cart
export const clearCart = async (req, res) => {
  const userId = req.user;

  try {
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);

    const cartSnapshot = await userCartRef.get();

    const batch = db.batch();

    cartSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

