import { ApiMethods } from "../ApiMethods";
import PAYMENT_ENDPOINTS from "../endpoints/paymentEndpoint";

export const getClientSecret = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_SETUP);
}

export const getClientPaymentMethod = () => {
    return ApiMethods.get(PAYMENT_ENDPOINTS.PAYMENT_METHOD);
}

export const createPaymentIntent = (total, subtotal, shippingFee, paymentMethodID = null, shipping = null) => {
    total *= 100

    const body = {
        subtotal,
        shippingFee,
        total,
    }

    if (paymentMethodID && shipping){
        body.paymentMethodID = paymentMethodID
        body.shipping = shipping
    }
    
    return ApiMethods.post(PAYMENT_ENDPOINTS.PAYMENT_INTENT, body)
}

export const updatePaymentIntent = (total,  subtotal, shippingFee, paymentIntentID, shippingAddress) => {
    total *= 100
    const payload = {};
    if (total !== null && total !== undefined) payload.total = total;
    if (subtotal !== null && subtotal !== undefined) payload.subtotal = subtotal;
    if (shippingFee !== null && shippingFee !== undefined) payload.shippingFee = shippingFee;
    if (paymentIntentID !== null && paymentIntentID !== undefined) payload.paymentIntentID = paymentIntentID;
    if (shippingAddress !== null && shippingAddress !== undefined) payload.shippingAddress = shippingAddress;

    return ApiMethods.post(PAYMENT_ENDPOINTS.UPDATE_PAYMENT, payload);
}

export const deleteClientPaymentMethod = (paymentIDMethod) => {
    return ApiMethods.delete(PAYMENT_ENDPOINTS.PAYMENT_ROUTE(paymentIDMethod));
}

