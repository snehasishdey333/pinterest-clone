import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"


const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
        <Sidebar/>
        
        <div className="flex-1 w-full">
            <Navbar/>
            <div className="p-4 w-full">
            <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default MainLayout