import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { addReview, deleteReview, getReview, updateReview } from '../controllers/reviewController.js';
import { newReviewSchema, updateReviewSchema } from '../schema/reviewSchema.js';

const publicReviewRouter = express.Router();
const adminReviewRouter = express.Router();

publicReviewRouter.get('/:productID', getReview);
publicReviewRouter.post('/', validateRequest(newReviewSchema), addReview);
publicReviewRouter.patch('/:id', validateRequest(updateReviewSchema), updateReview);
publicReviewRouter.delete('/:id', deleteReview);

export {publicReviewRouter,adminReviewRouter };