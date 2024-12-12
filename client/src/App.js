import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
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


function App() {

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Customer/>}>
              <Route path='' element={<Home/>}></Route>
              <Route path='shop' element={<Shop/>}></Route>
              <Route path='eco-point' element={<EcoPoint/>}></Route>
              <Route path='about' element={<About/>}></Route>
              <Route path='wishlist' element={<Wishlist/>}></Route>
              <Route path='cart' element={<Cart/>}></Route>
              <Route path='account' element={<Accout/>}></Route>
              <Route path='product' element={<Product/>}></Route>
              <Route path='login' element={<LoginSignUp/>}></Route>
            </Route>
            
            <Route path='/admin' element={<AdminRoutes/>}>
              
            </Route>

          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
