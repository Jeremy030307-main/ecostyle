import { db } from "../firebase.js";
import { getVariantDetails } from "./productController.js";
import { COLLECTIONS, message } from "./utility.js";

export const getUserWishlist = async (req, res) => {
  const uid = req.user;

  try {
    await db.runTransaction(async (transaction) => {
      // Reference to the user's wishlist collection
      const userWishlistRef = db
        .collection(COLLECTIONS.USER)
        .doc(uid)
        .collection(COLLECTIONS.WISHLIST);

      const snapshot = await transaction.get(userWishlistRef);

      if (snapshot.empty) {
        res.status(200).json([]);
        return;
      }

      // Fetch product details for each product ID in the wishlist
      const wishlistPromises = snapshot.docs.map(async (doc) => {
        const productId = doc.id; // Assuming the document ID corresponds to the product ID
        const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productId);

        try {
          const productDoc = await transaction.get(productRef);
          if (productDoc.exists) {
            const productData = productDoc.data();

            // Fetch variant details (simulating this outside the transaction)
            const variant = await getVariantDetails(productId, productData.variant, transaction);

            return {
              id: productId,
              name: productData.name,
              price: productData.price,
              thumbnail: productData.thumbnail,
              variant: variant,
              size: productData.size,
              rating: productData.rating || null,
              reviewCount: productData.reviewCount || null,
              category: productData.category,
              collection: productData.collection,
              color: productData.color,
            };
          } else {
            console.warn(`Product with ID ${productId} not found`);
            return null;
          }
        } catch (productError) {
          console.error(`Error fetching product data for productId ${productId}:`, productError);
          return null;
        }
      });

      // Resolve all promises and filter nulls
      const wishlist = await Promise.all(wishlistPromises);
      const filteredWishlist = wishlist.filter((item) => item !== null);

      // Send the wishlist data as a JSON response
      res.status(200).json(filteredWishlist);
    });
  } catch (error) {
    console.error("Error retrieving wishlist data:", error);
    res.status(500).json({ error: "Failed to retrieve wishlist" });
  }
};


export const addProductToWishlist = async (req, res) => {
    const uid = req.user; // Assuming middleware populates `req.user` with the authenticated user's ID
    const { productID } = req.params; // Fix destructuring to access `productID`
  
    try {
      // Reference to the user's wishlist collection
      const userWishlistRef = db.collection(COLLECTIONS.USER).doc(uid).collection(COLLECTIONS.WISHLIST);
      const wishlistProductRef = userWishlistRef.doc(productID);
  
      // Check if the product is already in the wishlist
      const wishlistProductDoc = await wishlistProductRef.get();
      if (wishlistProductDoc.exists) {
        return res.status(400).json({ message: "Product already in wishlist." });
      }
  
      // Add a new product to the wishlist
      await wishlistProductRef.set({
        addedAt: new Date().toISOString(), // Optionally store when the product was added
      });
  
      // Respond with success
      res.status(200).json({ message: "Product added to wishlist successfully." });
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      res.status(500).json({ error: "Failed to add product to wishlist." });
    }
};

// Remove a product from the user's cart
export const removeWishlistProduct = async (req, res) => {

  const uid = req.user;
  const { productID } = req.params; // Fix destructuring to access `productID`

  try {
    const productRef = db.collection(COLLECTIONS.USER).doc(uid).collection(COLLECTIONS.WISHLIST).doc(productID);

    await productRef.delete();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};



