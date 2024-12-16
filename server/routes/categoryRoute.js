import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { getCategories, addCategory, deleteCategory} from '../controllers/categoryController.js';
import { categorySchema } from '../schema/categorySchema.js';


const categoryRouter = express.Router();

categoryRouter.get('/:id?', getCategories);

// -------- Admin Route --------------
categoryRouter.post('/:parentID?',validateRequest(categorySchema), addCategory)

categoryRouter.delete('/:id', deleteCategory)

export default categoryRouter;