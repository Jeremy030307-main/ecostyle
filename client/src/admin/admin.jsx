import { Outlet } from "react-router-dom"
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";



const Admin = () => {
  return (
    <div>
      <Navbar/>
      <hr/>
      <Sidebar/>
      <Outlet/>
    </div>
  );
}
 
export default Admin;