import Sidebar from "./Components/Sidebar/Sidebar"
import Navbar from "./Components/Navbar/Navbar"
import { Outlet } from "react-router-dom"
import "./admin.css"

const Admin = () => {
  return (
    <div>
      <Navbar/>
      <hr/>
      <div className="content-wrapper">
        <Sidebar/>
        <div className="main-content">
          <Outlet/>
        </div>
      </div>

    </div>
    
  );
}
 
export default Admin;
