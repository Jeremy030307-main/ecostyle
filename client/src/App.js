import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import EcoPoint from './Pages/EcoPoint';
import About from './Pages/About';
import Cart from './Pages/Cart';
import Wishlist from './Pages/Wishlist'; 
import Accout from './Pages/Accout';
import Product from './Pages/Product';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path='/' element={<Shop/>}></Route>
        <Route path='/eco-point' element={<EcoPoint/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/wishlist' element={<Wishlist/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/account' element={<Accout/>}></Route>
        <Route path='/account' element={<Product/>}>
          <Route path=':productID' element={<Product/>}></Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
