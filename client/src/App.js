import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import LoginSignUp from './customer/Pages/LoginSignUp';
import Contact from './customer/Pages/Contact';
import Footer from './customer/Pages/Footer';
import NotFound from './customer/Pages/NotFound';

import AdminRoutes from './authentication/protectedRoute';
import { AuthProvider } from './authentication/authContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

function MainApp() {
  const location = useLocation();

  // List of paths where the footer should not appear
  const noFooterPaths = ['/admin', '/login'];

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
          <Route path='contact' element={<Contact />} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path='/admin' element={<Admin />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* Conditional Footer */}
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
