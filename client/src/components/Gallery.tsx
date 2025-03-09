import { useQuery } from "@tanstack/react-query";
import { fetchPins } from "../utils/apis";
import Pin from "./Pin";





const Gallery = ({search}:{search:string}) => {
  // console.log(search)
    const {data,isPending,isError} = useQuery({
      queryKey: ['pins', search], 
    queryFn: () => fetchPins(search),
    })
    if(isPending){
      return <div>Loading...</div>
    }
    if(isError){
      return <div>Something went wrong!</div>
    }

    if(data.length==0){
      return <div>No results found!</div>
    }
   
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-3 p-4">
      
      {data?.map((pin:any,index:number) => (
        <Pin data={pin} index={index}/>
      ))}
    </div>
  );
}

export default Gallery