import { Link, useNavigate } from "react-router"
import { useAuthStore } from "../store/AuthStore"
import { apiClient } from "../utils/apiClient"


const Menu = () => {
  const {removeCurrentUser}=useAuthStore()
  const navigate=useNavigate()
  const handleLogout=async()=>{
    try{
       await apiClient.get("/api/auth/logout")
       removeCurrentUser()
       navigate("/auth")
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className="absolute right-0 z-40 top-10 px-3 py-2 flex items-start flex-col bg-white text-[14px] rounded-md w-[100px]">
        <Link to="/create" className="p-2 rounded-full hover:bg-gray-100 w-full">Create</Link>
        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 w-full">Profile</Link>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 w-full">Logout</button>
    </div>
  )
}

export default Menu


