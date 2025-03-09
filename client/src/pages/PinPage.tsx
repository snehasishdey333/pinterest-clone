import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {  useNavigate, useParams } from 'react-router';
import { fetchPin, postComment } from '../utils/apis';
import CommentForm from '../components/CommentForm';





const PinPage = () => {
  // const [comments, setComments] = useState<string[]>(commentList);
  
  const { id } = useParams<{ id: string }>();
  const navigate=useNavigate()


  const { data, isPending, isError } = useQuery({
    queryKey: ['pin', id],
    queryFn: () => fetchPin(id as string),
    enabled: !!id,
  })

  

  if(isPending){
    return <div>loading...</div>
  }
  if(isError){
    return <div>Something went wrong!</div>
  }
  

  
  
  // console.log(data)

  return (
    <div className="w-full md:max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg flex h-[600px] flex-col md:flex-row">
        {/* Left Section - Image */}
        <div className="md:w-2/3 rounded-lg h-full w-full">
          <img
            src={data?.image}
            alt="Pin"
            className="w-full h-full object-cover rounded-lg md:rounded-l-lg"
          />
        </div>

        {/* Right Section - Details */}
        <div className="w-full md:w-1/3 p-4 flex flex-col justify-between h-full">
          <div>
            <div className="w-full flex justify-between items-center">
              <div onClick={()=>navigate(`/user/${data?.userId}`)} className="cursor-pointer flex items-center gap-2">
              {data?.user?.image ? <img src="/public/assets/asset 0.jpeg" alt="" className="w-8 h-8 rounded-full" />
       : <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-sm">
       {data?.user?.name.charAt(0)}
     </div>}
                <span className="text-sm font-semibold">{data?.user.username}</span>
              </div>
              <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Save</button>
            </div>
            <h1 className="text-xl font-bold my-3">{data?.title}</h1>
            <p className="text-sm text-gray-600 mb-4">
              {data?.description}
              
            </p>

            <button onClick={()=>window.open(data?.link, '_blank')} className="bg-gray-200 text-sm text-gray-700 rounded-full py-1 mb-4 w-full">Visit site</button>
            <div  className="border-t pt-4">
            <h2 className="text-md font-semibold mb-2">Comments</h2>
            <div className="space-y-2 mb-4 overflow-y-scroll h-[250px]">
              {data?.comments.map((comment:any, index:number) => (
                <div key={index} className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                  {comment.comment}
                </div>
              ))}
            </div>
            </div>
          </div>

          

          
          <CommentForm data={data} id={id!}/>
        </div>
      </div>
    </div>
  );
};

export default PinPage;