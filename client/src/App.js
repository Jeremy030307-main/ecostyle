import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext.js'; // Import CartProvider
import { WishlistProvider } from './WishlistContext'; // Import WishlistProvider

import Customer from './customer/customer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Shop from './customer/Pages/Shop';
import EcoPoint from './customer/Pages/EcoPoint';
import About from './customer/Pages/About';
import Cart from './customer/Pages/Cart';
import Wishlist from './customer/Pages/Wishlist';
import Account from './customer/Pages/Account';
import Product from './customer/Pages/Product';
import Home from './customer/Pages/Home';
import Admin from './admin/admin';
import MyAccount from './customer/Pages/MyAccount';
import Cancellation from './customer/Pages/Cancellation';
import AccountOrder from './customer/Pages/AccountOrder';
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
import Checkout from './customer/Checkout/Checkout.jsx';

function App() {
  return (
    <CartProvider> {/* Wrap the entire app in CartProvider */}
      <WishlistProvider> {/* Wrap the entire app in WishlistProvider */}
        <BrowserRouter>
          <MainApp /> {/* Use MainApp to handle routing and footer */}
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

function MainApp() {
  const location = useLocation();

  // List of paths where the footer should not appear
  const noFooterPaths = ['/admin', '/login', '/contact'];

  return (
    <>
      <Routes>
        <Route path='/' element={<Customer />}>
          <Route path='' element={<Home />} />
          <Route path='shop' element={<Shop />} />
          <Route path='eco-point' element={<EcoPoint />} />
          <Route path='about' element={<About />} />
          <Route path='wishlist' element={<Wishlist />} />
          <Route path='cart' element={<Cart />} />
          <Route path='account' element={<Account />} />
          <Route path='product' element={<Product />} />
          <Route path='login' element={<LoginSignUp />} />
          <Route path='myaccount' element={<MyAccount />} />
          <Route path='cancellation' element={<Cancellation />} />
          <Route path='AccountOrder' element={<AccountOrder />} />
          <Route path='contact' element={<Contact />} />
        </Route>

        <Route path='/checkout' element={<Checkout />} />

        <Route path='/admin' element={<AdminRoutes />}>
          <Route path='' element={<Admin />}>
            <Route path='add' element={<AddProducts />} />
            <Route path='products' element={<Products />} />
            <Route path='orders' element={<Orders />} />
            <Route path='collections' element={<Collections />} />
            <Route path='addCollections' element={<AddCollections />} />
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
