
const ENDPOINTS = {
  
    SIGN_UP: '/user/signUp',
    SIGN_IN: '/user/signIn',
    SIGN_OUT: '/user/signOut',
    GET_USER: (userID) => `/user/${userID}`,
    GET_PRODUCTS: '/product',
}

export default ENDPOINTS;