import express from 'express';
import { createPayment, deleteClientPaymentMethod, getClientPaymentMethod, getClientSecret } from '../controllers/paymentController.js';

const paymentRoute = express.Router();

paymentRoute.get("/secret", getClientSecret);
paymentRoute.get('/payment-method', getClientPaymentMethod)

paymentRoute.post('/create-payment-intent', createPayment)

paymentRoute.delete('/:paymentID', deleteClientPaymentMethod)

export default paymentRoute ;  