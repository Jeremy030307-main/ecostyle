const PAYMENT_ENDPOINTS = {
  
    PAYMENT_SETUP : `/payment/secret`,
    PAYMENT_METHOD:  `/payment/payment-method`,
    PAYMENT_INTENT: '/payment/create-payment-intent',
    PAYMENT_ROUTE: (id) => `/payment/${id}`

}

export default PAYMENT_ENDPOINTS;