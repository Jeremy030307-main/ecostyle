import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  updateSize,
  deleteSize
} from '../controllers/productController.js';
import { variantSchema, productSchema, updateProductSchema } from '../schema/productSchema.js';
import { checkCategory } from '../controllers/categoryController.js';
import { checkCollection } from '../controllers/collectionController.js';
import { checkColor } from '../controllers/colorController.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProduct);

// -------- Admin Route --------------

// product
productRouter.post('/', validateRequest(productSchema, checkCategory, checkCollection), createProduct);
productRouter.put('/:id',validateRequest(updateProductSchema, checkCategory, checkCollection), updateProduct);
productRouter.delete('/:id', deleteProduct);

// variant
productRouter.post('/:id/variant', validateRequest(variantSchema, checkColor), addVariant);
productRouter.put('/:id/variant', validateRequest(variantSchema), updateVariant);
productRouter.delete('/:productID/variant/:variantID', deleteVariant);

// size
productRouter.put('/:productID/size/:size', updateSize);
productRouter.delete('/:productID/size/:size', deleteSize);

export default productRouter;