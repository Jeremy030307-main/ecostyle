import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js";

// Retrieve the user's cart
export const getUserCart = async (req, res) => {
    const userId = req.user;
  
    try {
      const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);
      const cartSnapshot = await userCartRef.get();
  
      const cart = cartSnapshot.docs.map(doc => ({
        ...doc.data()
      }));
  
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
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

