import { ApiMethods } from "../ApiMethods";
import PAYMENT_ENDPOINTS from "../endpoints/paymentEndpoint";

export const getClientSecret = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_SETUP);
}

export const getClientPaymentMethod = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_METHOD);
}

export const createPaymentIntent = (total, paymentMethodID = null, shipping = null) => {
    total *= 100

    const body = {
        total
    }

    if (paymentMethodID && shipping){
        body.paymentMethodID = paymentMethodID
        body.shipping = shipping
    }
    
    return ApiMethods.post(PAYMENT_ENDPOINTS.PAYMENT_INTENT, body)
}

export const deleteClientPaymentMethod = (paymentIDMethod) => {
    return ApiMethods.delete(PAYMENT_ENDPOINTS.PAYMENT_ROUTE(paymentIDMethod));
}

