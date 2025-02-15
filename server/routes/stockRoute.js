import express from 'express';
import { addReview, deleteReview, getProductReview, getUserReview, updateReview } from '../controllers/reviewController.js';
import { newReviewSchema, updateReviewSchema } from '../schema/reviewSchema.js';
import { addStock, decreaseStock } from '../controllers/stockController.js';

const stockRouter = express.Router();

stockRouter.put("/increase", addStock)
stockRouter.put("/decrease", decreaseStock)

export default stockRouter;