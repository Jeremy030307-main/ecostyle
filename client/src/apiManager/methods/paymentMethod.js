import { ApiMethods } from "../ApiMethods";
import PAYMENT_ENDPOINTS from "../endpoints/paymentEndpoint";

export const getClientSecret = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_SETUP);
}

export const getClientPaymentMethod = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_METHOD);
}

export const createPaymentIntent = (total) => {
    total *= 100
    return ApiMethods.post(PAYMENT_ENDPOINTS.PAYMENT_INTENT, {total})
}

export const deleteClientPaymentMethod = (paymentIDMethod) => {
    return ApiMethods.delete(PAYMENT_ENDPOINTS.PAYMENT_ROUTE(paymentIDMethod));
}

