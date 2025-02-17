import { ApiMethods } from "../ApiMethods"
import ORDER_ENDPOINTS from "../endpoints/orderEndpoint"
import useSEE from "../useSEE"

export const getUserOrder = () => {
    return ApiMethods.get(ORDER_ENDPOINTS.ORDER_ROUTE)
} 

export const useOrder = () => {
    return useSEE(ORDER_ENDPOINTS.ADMIN_ORDER_ROUTE);
}

export const createNewOrder = (cartsData,paymentIntentID) => {
    return ApiMethods.post(ORDER_ENDPOINTS.PLACE_ORDER, {
        cartsData, paymentIntentID
    } )
}

export const payOrder = (paymentIntentID) => {
    return ApiMethods.put(ORDER_ENDPOINTS.PAY_ORDER, {
        paymentIntentID
    } )
}