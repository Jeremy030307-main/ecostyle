import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js";

export const getUserCart = async (req, res) => {
  const userId = req.user;

  try {
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);

    // Fetch the user's cart data from Firestore
    const snapshot = await userCartRef.get();

    const cart = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const cartData = {
          id: doc.id, // Include document ID for reference
          ...doc.data(),
        };

        // Retrieve the product ID from the cart data and fetch the product details
        const productId = cartData.product; // Assuming 'product' field contains the product ID
        const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productId);

        try {
          const productDoc = await productRef.get();
          if (productDoc.exists) {
            const productData = productDoc.data();

            // Extract only the required fields
            const selectedVariant = productData.variant.find(
              (v) => v.color === cartData.variant
            );

            cartData.name = productData.name;
            cartData.price = productData.price;
            cartData.image = selectedVariant ? selectedVariant.image : null;
          } else {
            console.warn(`Product with ID ${productId} not found`);
            cartData.productDetails = null;
          }
        } catch (productError) {
          console.error(`Error fetching product data for productId ${productId}:`, productError);
          cartData.productDetails = null;
        }

        return cartData;
      })
    );

    // Send the cart data as a JSON response
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart data:", error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

// Add a product to the user's cart
export const addProductToCart = async (req, res) => {
  const userId = req.user;
  const { product, variant, size, quantity } = req.body;
 
  try {
    const cartProductID = `${product}_${variant}_${size}`
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);
    const productRef = userCartRef.doc(cartProductID);

    const productDoc = await productRef.get();
    if (productDoc.exists) {
      return res.status(400).send(message("Product already in cart."))
    }
    // Add a new product to the cart
    await productRef.set({
    product,
    variant, 
    size,
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
  const { cartProductID, quantity} = req.body;

  try {
    const productRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART).doc(cartProductID);

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
  console.log("fdfdfsdf")
  const userId = req.user;
  const product = req.params.cartProductID;

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

export const checkout = async (req, res) => {
  const userId = req.user;

  try {
    let cartData = [];
    let shippingFeeData = []
    const userCartRef = db.collection(COLLECTIONS.USER).doc(userId).collection(COLLECTIONS.CART);
    const shippingFeeRef = db.collection('shippingFee')

    await db.runTransaction(async (transaction) => {
      const cartSnapshot = await transaction.get(userCartRef);
      
      // Iterate over each cart document
      cartData = await Promise.all(
        cartSnapshot.docs.map(async (doc) => {
          const cartItem = doc.data();
          const productId = cartItem.product; // Assuming 'product' field contains the product ID
          const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productId);

          try {
            // Fetch the product details
            const productDoc = await productRef.get();
            if (productDoc.exists) {
              const productData = productDoc.data();

              // Assuming product has a 'variant' field and we want to find the selected variant
              const selectedVariant = productData.variant.find(
                (v) => v.color === cartItem.variant
              );

              // Add the product details to the cart item
              cartItem.name = productData.name;
              cartItem.price = productData.price;
              cartItem.image = selectedVariant ? selectedVariant.image : null;
            } else {
              console.warn(`Product with ID ${productId} not found`);
              cartItem.productDetails = null;
            }
          } catch (productError) {
            console.error(`Error fetching product data for productId ${productId}:`, productError);
            cartItem.productDetails = null;
          }

          return {
            id: doc.id, // Include document ID for reference
            ...cartItem,
          };
        })
      );

      const shippingFeeSnapshot = await transaction.get(shippingFeeRef)
      shippingFeeData = await Promise.all(
        shippingFeeSnapshot.docs.map(async (doc) => {
          const shippingFeeItem = doc.data();

          return {
            id: doc.id, // Include document ID for reference
            ...shippingFeeItem,
          };
        })
      );

    });

    // Send the updated cart data back to the client
    res.status(200).json({cartData, shippingFeeData});

  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(400).send({ message: error.message });
  }
};



