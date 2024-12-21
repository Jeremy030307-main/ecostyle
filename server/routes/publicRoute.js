import express from 'express';
import { publicCollectionRouter } from "./collectionRoute.js";
import { publicColorRouter } from './colorRoute.js';
import { publicCategoryRouter } from './categoryRoute.js';
import { publicUserRouter } from './userRoute.js';
import { publicProductRouter } from './productRoute.js';

const publicRouter = express.Router()

publicRouter.use("/user", publicUserRouter);
publicRouter.use("/collection", publicCollectionRouter);
publicRouter.use("/color", publicColorRouter);
publicRouter.use("/category", publicCategoryRouter);
publicRouter.use("/product", publicProductRouter)

export default publicRouter;