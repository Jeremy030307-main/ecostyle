const PRODUCT_ENDPOINTS = {
  
    PRODUCT_ROUTE: (productID = "") => `/product/${productID}`,
    ADMIN_PRODUCT_ROUTE: (productID = "") =>  `/admin/product/${productID}`,
    ADMIN_VARIANT_ROUTE: (productID = "", variant = "") =>  `/admin/product/${productID}/variant/${variant}`,
    ADMIN_SIZE_ROUTE: (productID = "", size) =>  `/admin/product/${productID}/size/${size}`,
}

export default PRODUCT_ENDPOINTS;