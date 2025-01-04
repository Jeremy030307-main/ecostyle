import express from 'express';
import { addProductToCart, checkout, clearCart, getUserCart, removeCartProduct, updateCartProductQuantity } from '../controllers/cartController.js';
import { validateRequest } from './middleware.js';
import { cartItemSchema } from '../schema/cartSchema.js';
import { checkProduct } from '../controllers/productController.js';

const cartRouter = express.Router();

cartRouter.get('/', getUserCart); 
cartRouter.get('/checkout', checkout)

// Add product to cart
cartRouter.post('/', addProductToCart);

// Update cart product quantity
cartRouter.put('/', validateRequest(cartItemSchema), updateCartProductQuantity);

// Remove a product from the cart
cartRouter.delete('/:cartProductID', removeCartProduct);

// Clear the cart
cartRouter.delete('/', clearCart);

export default cartRouter;