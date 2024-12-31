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
import MyAccount from './customer/Pages/MyAccount';
import Cancellation from './customer/Pages/Cancellation';
import AccountOrder from './customer/Pages/AccountOrder';
import LoginSignUp from './customer/Pages/LoginSignUp';

//import Admin from './admin/admin';
import Add from './admin/Pages/Add';
import Products from './admin/Pages/Products';
import Orders from './admin/Pages/Orders';

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
              <Route path='myaccount' element={<MyAccount/>}></Route>
              <Route path='cancellation' element={<Cancellation/>}></Route>
              <Route path='AccountOrder' element={<AccountOrder/>}></Route>


            </Route>
            
            <Route path='/admin' element={<AdminRoutes/>}>
              <Route path='' element={<Admin/>}>
                <Route path='add' element={<Add/>}></Route>
                <Route path='products' element={<Products/>}></Route>
                <Route path='orders' element={<Orders/>}></Route>
              </Route>
            </Route>

          </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
