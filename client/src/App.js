import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
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
// import NotFound from './customer/Pages/NotFound';

import AdminRoutes from './authentication/protectedRoute';
import { AuthProvider } from './authentication/authContext';


function App() {

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
              <Route path='/' element={<Customer/>}>
                <Route path='' element={<Home/>}></Route>
                <Route path='shop' element={<Shop/>}></Route>
                <Route path='eco-point' element={<EcoPoint/>}></Route>
                <Route path='about' element={<About/>}></Route>
                <Route path='wishlist' element={<Wishlist/>}></Route>
                <Route path='cart' element={<Cart/>}></Route>
                <Route path='account' element={<Account/>}></Route>
                <Route path='product' element={<Product/>}></Route>
                <Route path='login' element={<LoginSignUp/>}></Route>
              </Route>

            
            <Route element={<AdminRoutes/>}>
              <Route path='/admin' element={<Admin/>}></Route>
            </Route>
            {/* <Route path='*' element={<NotFound/>}></Route> */}

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
