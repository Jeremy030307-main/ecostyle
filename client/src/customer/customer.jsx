import Navbar from './Components/Navbar/Navbar';
import { Outlet } from "react-router-dom"


const Customer = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  );
}
 
export default Customer;