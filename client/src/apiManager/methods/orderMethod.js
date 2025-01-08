import { ApiMethods } from "../ApiMethods"
import ORDER_ENDPOINTS from "../endpoints/orderEndpoint"
import useSEE from "../useSEE"

export const getUserOrder = () => {
    return ApiMethods.get(ORDER_ENDPOINTS.ORDER_ROUTE)
} 

export const useOrder = () => {
    return useSEE(ORDER_ENDPOINTS.ADMIN_ORDER_ROUTE);
}

export const createNewOrder = (cartsData, total, shippingAddress, paymentDetails) => {
    return ApiMethods.post(ORDER_ENDPOINTS.ORDER_ROUTE, {
        cartsData, total, shippingAddress, paymentDetails
    } )
}