import express from 'express';
import { authenticate, isAdmin } from '../authentication/middleware.js';
import { addCollection } from '../controllers/collectionController.js';


const collectionRouter = express.Router();

// collectionRouter.get('/', getCategories);

// collectionRouter.get('/:id', getCategory);

collectionRouter.post('/', addCollection)

// collectionRouter.delete('/:id', deleteCategory)

export default collectionRouter;