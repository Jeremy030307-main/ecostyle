import express from 'express';
import { validateRequest } from './middleware.js';
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
import { checkColor, checkColors } from '../controllers/colorController.js';

const publicProductRouter = express.Router();
const adminProductRouter = express.Router();

publicProductRouter.get('/', getProducts);
publicProductRouter.get('/:id', getProduct);

// -------- Admin Route --------------

// product
adminProductRouter.post('/', validateRequest(productSchema, checkCategory, checkCollection, checkColors), createProduct);
adminProductRouter.put('/:id',validateRequest(updateProductSchema, checkCategory, checkCollection), updateProduct);
adminProductRouter.delete('/:id', deleteProduct);

// variant
adminProductRouter.post('/:id/variant', validateRequest(variantSchema, checkColor), addVariant);
adminProductRouter.put('/:id/variant', validateRequest(variantSchema, checkColor), updateVariant);
adminProductRouter.delete('/:productID/variant/:variantID', deleteVariant);

// size
adminProductRouter.patch('/:productID/size/:size', updateSize);
adminProductRouter.delete('/:productID/size/:size', deleteSize);

export {publicProductRouter, adminProductRouter};