import express from 'express';
import { addProductToWishlist, getUserWishlist, removeWishlistProduct } from '../controllers/wishlistController.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', getUserWishlist); 

// Add product to wishlist
wishlistRouter.post('/:productID', addProductToWishlist);

// Remove a product from the wishlist
wishlistRouter.delete('/:productID', removeWishlistProduct);

export default wishlistRouter;