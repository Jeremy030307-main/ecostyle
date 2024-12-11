import express from 'express';
import { authenticate, isAdmin } from '../authentication/middleware.js';

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);

productRouter.get('/:id', getProduct);

productRouter.post('/',isAdmin, createProduct);

productRouter.put('/:id',isAdmin, updateProduct);

productRouter.delete('/:id',isAdmin, deleteProduct);

export default productRouter;