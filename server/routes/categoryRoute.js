import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { getCategories, addCategory, deleteCategory} from '../controllers/categoryController.js';
import Joi from "joi";

// Define a schema for validation
const categorySchema = Joi.object({
    name: Joi.string().min(1).required()
});

const categoryRouter = express.Router();

categoryRouter.get('/:id?', getCategories);
// categoryRouter.get('/:id', getCategory);

// -------- Admin Route --------------
categoryRouter.post('/:parentID?', addCategory)

categoryRouter.delete('/:id', deleteCategory)

export default categoryRouter;