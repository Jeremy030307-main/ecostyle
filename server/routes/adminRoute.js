import express from 'express';
import { adminCollectionRouter } from "./collectionRoute.js";
import { adminColorRouter } from './colorRoute.js';
import { adminCategoryRouter } from './categoryRoute.js';
import { adminUserRouter } from './userRoute.js';
import { adminProductRouter } from './productRoute.js';
import { adminOrderRouter } from './orderRoute.js';
import stockRouter from './stockRoute.js';

const adminRouter = express.Router();

adminRouter.use("/user", adminUserRouter);
adminRouter.use("/collection", adminCollectionRouter);
adminRouter.use("/color", adminColorRouter);
adminRouter.use('/category', adminCategoryRouter);
adminRouter.use("/product", adminProductRouter);
adminRouter.use("/order", adminOrderRouter);
adminRouter.use("/stock", stockRouter)

export default adminRouter;