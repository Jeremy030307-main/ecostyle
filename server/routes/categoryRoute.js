import express from 'express';
import { authenticate, isAdmin } from '../authentication/middleware.js';

import { getCategories, getCategory, addCategory, deleteCategory} from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);

categoryRouter.get('/:id', getCategory);

categoryRouter.post('/',isAdmin, addCategory)

categoryRouter.delete('/:id',isAdmin, deleteCategory)

export default categoryRouter;