import express from 'express';
import { validateRequest } from './middleware.js';
import { addcolor, deleteColor, getColors } from '../controllers/colorController.js';
import { newColorSchema } from '../schema/colorSchema.js';
import { createOrder, getAllOrder, getUserOrder, orderCompleted, orderReceived, orderShipOut, paidOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();
const adminOrderRouter = express.Router()

orderRouter.post("/place-order", createOrder)
orderRouter.put("/pay-order", paidOrder)
orderRouter.put("/order-shipping", orderShipOut)
orderRouter.put("/order-received", orderReceived)
orderRouter.put("/order-complete", orderCompleted)

orderRouter.get("/", getUserOrder)

adminOrderRouter.get("/", getAllOrder)

export  {orderRouter, adminOrderRouter};