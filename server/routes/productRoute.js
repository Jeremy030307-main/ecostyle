import express from 'express';
import authenticate from '../authentication/middleware.js';

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/',authenticate, getProducts);
productRouter.get('/:id',authenticate, getProduct);

productRouter.post('/new', createProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;