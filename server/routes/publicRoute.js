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
import paymentRoute from './paymentRoute.js';
import {orderRouter} from './orderRoute.js';

const publicRouter = express.Router()

publicRouter.use("/user", publicUserRouter);
publicRouter.use("/collection", publicCollectionRouter);
publicRouter.use("/color", publicColorRouter);
publicRouter.use("/category", publicCategoryRouter);
publicRouter.use("/product", publicProductRouter);
publicRouter.use("/review", publicReviewRouter);
publicRouter.use("/cart", authenticate, cartRouter);
publicRouter.use("/address", authenticate, addressRouter);
publicRouter.use("/payment", authenticate, paymentRoute);
publicRouter.use("/order",authenticate, orderRouter)

export default publicRouter;