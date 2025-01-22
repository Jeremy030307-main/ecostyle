import { ApiMethods } from "../ApiMethods";
import STOCK_ENDPOINTS from "../endpoints/stockEndpoint";


export const increaseStock = (productID, size, variant, quantity) => {
    const body = {
        productID, size, variant, quantity
    }

    return ApiMethods.put(STOCK_ENDPOINTS.INCREASE, body)
}

export const decreaseStock = (productID, size, variant, quantity) => {
    const body = {
        productID, size, variant, quantity
    }

    return ApiMethods.put(STOCK_ENDPOINTS.DECREASE, body)
}