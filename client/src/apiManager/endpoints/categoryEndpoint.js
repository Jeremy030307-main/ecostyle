const CATEGORY_ENDPOINTS = {
  
    CATEGORY_ROUTE: (categoryID = "") => `/category/${categoryID}`,
    ADMIN_CATEGORY_ROUTE: (categoryID = "") => `/admin/category/${categoryID}`,
}

export default CATEGORY_ENDPOINTS;