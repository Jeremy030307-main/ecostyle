import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext.js'; // Import CartProvider
import { WishlistProvider } from './WishlistContext'; // Import WishlistProvider

import PrivacyPolicy from "./customer/Pages/PrivacyPolicy";
import FAQ from "./customer/Pages/faq.jsx";
import Customer from './customer/customer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Shop from './customer/Pages/Shop';
import EcoPoint from './customer/Pages/EcoPoint';
import About from './customer/Pages/About';
import Cart from './customer/Pages/Cart';
import Wishlist from './customer/Pages/Wishlist';
import Account from './customer/AccountDetails/Account.jsx';
import Product from './customer/Pages/Product';
import Home from './customer/Pages/Home';
import Admin from './admin/admin';
import Cancellation from './customer/AccountDetails/Cancellation.jsx';
import AccountOrder from './customer/AccountDetails/AccountOrder.jsx';
import LoginSignUp from './customer/Pages/LoginSignUp';
import Contact from './customer/Pages/Contact';
import Footer from './customer/Pages/Footer';
import NotFound from './customer/Pages/NotFound';

import AddProducts from './admin/Pages/products/AddProducts';
import Products from './admin/Pages/products/Products';
import Orders from './admin/Pages/Orders';

import AdminRoutes from './authentication/protectedRoute';
import Collections from './admin/Pages/collections/Collections';
import AddCollections from './admin/Pages/collections/AddCollections';
import EditProduct from './admin/Pages/products/EditProduct.jsx'
import Checkout from './customer/Checkout/Checkout.jsx'

import HomePage from './customer/Pages/HomePage.jsx';
import ScrollToTop from './ScrollToTop.jsx';

import AccountPaymentOptions from './customer/AccountDetails/AccountPaymentOptions.jsx';

import AddPaymentMethod from './customer/AccountDetails/AddPaymentMethod.jsx';
import AccountCardManagement from './customer/AccountDetails/AccountCardManagement.jsx';
import AddPaymentStatus from './customer/AccountDetails/AddPaymentStatus.jsx';
import AccountAddressbook from './customer/AccountDetails/AccountAddress.jsx';
import AddAcountAddress from './customer/AccountDetails/AddAccountAddress.jsx';
import CheckoutWrapper from './customer/Checkout/CheckoutWrapper.jsx';
import CheckoutComplete from './customer/Checkout/CheckoutComplete.jsx';
import AccountProfile from './customer/AccountDetails/AccountProfile.jsx';
import UpdateProfile from './customer/AccountDetails/UpdateProfile.jsx';
import { AuthProvider } from './authentication/authenticationManager.js';
import AccountOrderDetail from './customer/AccountDetails/AccountOrderDetail.jsx';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

function App() {

  return (
    <AuthProvider>
      <CartProvider> {/* Wrap the entire app in CartProvider */}
        <WishlistProvider> {/* Wrap the entire app in WishlistProvider */}
          <BrowserRouter>
            {/* <MainApp /> */}
            <ScrollToTop/>
            <MainApp />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const location = useLocation();

  // List of paths where the footer should not appear
  const noFooterPaths = ['/admin', '/login', '/contact'];

  return (
    <>
      <Routes>
        <Route path='/' element={<Customer/>}>
          <Route path='' element={<HomePage/>}></Route>
          <Route path='shop' element={<Shop/>}></Route>
          <Route path='eco-point' element={<EcoPoint/>}></Route>
          <Route path='about' element={<About/>}></Route>
          <Route path='wishlist' element={<Wishlist/>}></Route>
          <Route path='cart' element={<Cart />} /> {/* Cart page */}
          <Route path='product/:productID' element={<Product/>}></Route>
          <Route path='login' element={<LoginSignUp/>}></Route>
          <Route path='contact' element={<Contact/>}></Route>
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="faq" element={<FAQ />} />
          
      
          <Route path='account' element={<Account/>}>

            <Route index element={<AccountProfile/>}></Route>
            <Route path='update-profile' element={<UpdateProfile/>}></Route>

            <Route path='address-book' element={<AccountAddressbook/>}></Route>
            <Route path="address-book/address-management" element={<AccountCardManagement includeClientSecret={false}/>}>
              <Route path='add' element={<AddAcountAddress/>}></Route>
              <Route path='edit' element={<AddAcountAddress/>}></Route>
            </Route>

            <Route path="payment-options" element={<AccountPaymentOptions />} /> {/* Default: List cards */}
            <Route path="payment-options/card-management" element={<AccountCardManagement includeClientSecret={true}/>}>
              <Route path="add" element={<AddPaymentMethod />} />
              <Route path="success" element={<AddPaymentStatus />} />
            </Route>

            <Route path='order' element={<AccountOrder/>}></Route>
            <Route path='order/:orderID' element={<AccountOrderDetail/>}></Route>

            <Route path='cancellation' element={<Cancellation/>}></Route>

          </Route>
        </Route>

        <Route path="/checkout" element={<CheckoutWrapper/>}>
          <Route index element={<Checkout/>}/>
          <Route path='complete' element={<CheckoutComplete/>}></Route>
        </Route>
              

        <Route path='/admin' element={<AdminRoutes/>}>
          <Route path='' element={<Admin/>}>
            <Route path='add' element={<AddProducts/>}></Route>
            <Route path='products' element={<Products/>}></Route>
            <Route path='products/:id/edit' element={<EditProduct/>}></Route>
            <Route path='orders' element={<Orders/>}></Route>
            <Route path='collections' element={<Collections/>}></Route>
            <Route path='addCollections' element={<AddCollections/>}></Route>
          </Route>
        </Route>

        {/* Catch-all route for 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* Conditional Footer */}
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
