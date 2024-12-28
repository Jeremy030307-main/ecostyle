import express from 'express';
import { publicCollectionRouter } from "./collectionRoute.js";
import { publicColorRouter } from './colorRoute.js';
import { publicCategoryRouter } from './categoryRoute.js';
import { publicUserRouter } from './userRoute.js';
import { publicProductRouter } from './productRoute.js';
import { publicReviewRouter } from './reviewRoute.js';
import { authenticate } from './middleware.js';
import cartRouter from './cartRoute.js';
import addressRouter from './addressRoute.js';

const publicRouter = express.Router()

publicRouter.use("/user", publicUserRouter);
publicRouter.use("/collection", publicCollectionRouter);
publicRouter.use("/color", publicColorRouter);
publicRouter.use("/category", publicCategoryRouter);
publicRouter.use("/product", publicProductRouter);
publicRouter.use("/review", authenticate, publicReviewRouter);
publicRouter.use("/cart", authenticate, cartRouter);
publicRouter.use("/address", authenticate, addressRouter);

export default publicRouter;