import express from 'express';
import { validateRequest } from './middleware.js';
import { addReview, deleteReview, getProductReview, getUserReview, updateReview } from '../controllers/reviewController.js';
import { newReviewSchema, updateReviewSchema } from '../schema/reviewSchema.js';

const publicReviewRouter = express.Router();
const adminReviewRouter = express.Router();

publicReviewRouter.get('/:productID', getProductReview);
publicReviewRouter.get('/', getUserReview);

publicReviewRouter.post('/', validateRequest(newReviewSchema), addReview);
publicReviewRouter.patch('/:id', validateRequest(updateReviewSchema), updateReview);
publicReviewRouter.delete('/:id', deleteReview);

export {publicReviewRouter,adminReviewRouter };