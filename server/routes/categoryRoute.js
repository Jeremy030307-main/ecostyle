import express from 'express';
import { authenticate, isAdmin } from '../authentication/middleware.js';

import { getCategories, getCategory, addCategory, deleteCategory} from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/*', getCategory);

categoryRouter.post('/new', addCategory)
categoryRouter.delete('/delete', deleteCategory)

export default categoryRouter;