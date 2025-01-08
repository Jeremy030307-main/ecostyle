import express from 'express';
import { authenticate, validateRequest } from './middleware.js';
import { addReview, deleteReview, getProductReview, getUserReview, updateReview } from '../controllers/reviewController.js';
import { newReviewSchema, updateReviewSchema } from '../schema/reviewSchema.js';

const publicReviewRouter = express.Router();
const adminReviewRouter = express.Router();

publicReviewRouter.get('/:productID', getProductReview);
publicReviewRouter.get('/', authenticate, getUserReview);

publicReviewRouter.post('/',authenticate, validateRequest(newReviewSchema), addReview);
publicReviewRouter.patch('/:id',authenticate, validateRequest(updateReviewSchema), updateReview);
publicReviewRouter.delete('/:id',authenticate, deleteReview);

export {publicReviewRouter,adminReviewRouter };