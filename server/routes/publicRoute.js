import express from 'express';
import { publicCollectionRouter } from "./collectionRoute.js";
import { publicColorRouter } from './colorRoute.js';
import { publicCategoryRouter } from './categoryRoute.js';
import { publicUserRouter } from './userRoute.js';
import { publicProductRouter } from './productRoute.js';
import { publicReviewRouter } from './reviewRoute.js';
import { authenticate, userInfo } from './middleware.js';
import cartRouter from './cartRoute.js';
import addressRouter from './addressRoute.js';
import paymentRoute from './paymentRoute.js';
import {orderRouter} from './orderRoute.js';
import wishlistRouter from './wishlistRoute.js';
import stockRouter from './stockRoute.js';

const publicRouter = express.Router()

publicRouter.use("/user", publicUserRouter);
publicRouter.use("/collection", publicCollectionRouter);
publicRouter.use("/color", publicColorRouter);
publicRouter.use("/category", publicCategoryRouter);
publicRouter.use("/product", publicProductRouter);
publicRouter.use("/review", publicReviewRouter);
publicRouter.use("/cart", userInfo, cartRouter);
publicRouter.use("/address", authenticate, addressRouter);
publicRouter.use("/payment", authenticate, paymentRoute);
publicRouter.use("/order",authenticate, orderRouter)
publicRouter.use("/wishlist", userInfo, wishlistRouter);

export default publicRouter;