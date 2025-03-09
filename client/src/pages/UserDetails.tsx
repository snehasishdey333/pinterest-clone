
import { userProfile } from "../utils/data";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/apis";

import Pin from "../components/Pin";



const UserDetailsPage=() => {


  const {id}=useParams()
  const {data,isPending,isError} = useQuery({
    queryKey: ['userData', id], 
  queryFn: () => fetchUser(id as string),
  })
  if(isPending){
    return <div>Loading...</div>
  }
  if(isError){
    return <div>Something went wrong!</div>
  }

//   console.log(data)

  return (
    <div className="w-full mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
          {data?.name.charAt(0)}
        </div>
        <h1 className="text-2xl font-semibold mt-2">{data?.name}</h1>
        <p className="text-gray-600">{data?.username}</p>
        <p className="text-gray-500 mt-1">{userProfile.followers} followers • {userProfile.following} following</p>
        <div className="mt-4 space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded-lg">Message</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Follow</button>
        </div>
      </div>
      
      {/* Uploaded Images */}
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Uploaded Pins</h2>
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-3 p-4">
      {data?.pins?.map((pin:any,index:number) => (
        <Pin data={pin} index={index}/>
      ))}
      </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;