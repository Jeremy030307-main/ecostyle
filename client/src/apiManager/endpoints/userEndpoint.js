const USER_ENDPOINTS = {
  
    USER_ROUTE: (userID) => `/user/${userID}`,
    ADMIN_USER_ROUTE: (userID) => `admin/user/${userID}`,
    SET_ADMIN: (userID) => `admin/user/${userID}/set-admin`,
}

export default USER_ENDPOINTS;