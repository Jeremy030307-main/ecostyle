const CART_ENDPOINTS = {
  
    CART_ROUTE: (productID = "") => `/cart/${productID}`,
    CHECKOUT: "/cart/checkout"
}

export default CART_ENDPOINTS;