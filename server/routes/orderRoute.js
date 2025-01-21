import express from 'express';
import { validateRequest } from './middleware.js';
import { addcolor, deleteColor, getColors } from '../controllers/colorController.js';
import { newColorSchema } from '../schema/colorSchema.js';
import { createOrder, getAllOrder, getUserOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();
const adminOrderRouter = express.Router()

orderRouter.post("/", createOrder)
orderRouter.get("/", getUserOrder)

adminOrderRouter.get("/", getAllOrder)

export  {orderRouter, adminOrderRouter};