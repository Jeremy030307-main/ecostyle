import express from 'express';

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.post('/new', createProduct);
productRouter.get('/:id', getProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;