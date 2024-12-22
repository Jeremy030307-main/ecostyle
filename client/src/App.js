import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { CartProvider } from './CartContext.js'; // Import CartProvider

import Customer from './customer/customer';
import Shop from './customer/Pages/Shop';
import EcoPoint from './customer/Pages/EcoPoint';
import About from './customer/Pages/About';
import Cart from './customer/Pages/Cart';
import Wishlist from './customer/Pages/Wishlist'; 
import Accout from './customer/Pages/Accout';
import Product from './customer/Pages/Product';
import Home from './customer/Pages/Home';
import Admin from './admin/admin';
import LoginSignUp from './customer/Pages/LoginSignUp';
import AdminRoutes from './authentication/protectedRoute';
import Checkout from './customer/Pages/Checkout';

function App() {
  return (
    <CartProvider>  {/* Wrap the entire app in CartProvider */}
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Customer/>}>
              <Route path='' element={<Home/>}></Route>
              <Route path='shop' element={<Shop/>}></Route>
              <Route path='eco-point' element={<EcoPoint/>}></Route>
              <Route path='about' element={<About/>}></Route>
              <Route path='wishlist' element={<Wishlist/>}></Route>
              <Route path='cart' element={<Cart />} /> {/* Cart page */}
              <Route path='account' element={<Accout/>}></Route>
              <Route path='product' element={<Product/>}></Route>
              <Route path='login' element={<LoginSignUp/>}></Route>
              <Route path='checkout' element={<Checkout />} /> {/* Checkout page */}
            </Route>
            
            <Route path='/admin' element={<AdminRoutes/>}>
               {/* Your admin routes */}
            </Route>
          </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
