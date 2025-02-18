import express from 'express';
import { createPayment, deleteClientPaymentMethod, getClientPaymentMethod, getClientSecret, updatePayment } from '../controllers/paymentController.js';

const paymentRoute = express.Router();

paymentRoute.get("/secret", getClientSecret);
paymentRoute.get('/payment-method', getClientPaymentMethod)

paymentRoute.post('/create-payment-intent', createPayment)
paymentRoute.post('/update-payment-intent', updatePayment)

paymentRoute.delete('/:paymentID', deleteClientPaymentMethod)

export default paymentRoute ;  