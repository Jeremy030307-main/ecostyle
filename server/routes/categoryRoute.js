import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { getCategories, addCategory, deleteCategory} from '../controllers/categoryController.js';
import { categorySchema } from '../schema/categorySchema.js';

const publicCategoryRouter = express.Router();
const adminCategoryRouter = express.Router();

publicCategoryRouter.get('/:id?', getCategories);

// -------- Admin Route --------------
adminCategoryRouter.post('/:parentID?',validateRequest(categorySchema), addCategory)

adminCategoryRouter.delete('/:id', deleteCategory)

export {publicCategoryRouter,adminCategoryRouter };