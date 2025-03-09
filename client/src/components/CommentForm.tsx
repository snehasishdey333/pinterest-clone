import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { postComment } from '../utils/apis';
import { Pin } from '../types/types';



const CommentForm = ({data,id}:{data:Pin,id:string}) => {
    const [input, setInput] = useState<string>('');
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: () => postComment({
          comment: input,
          pinId: id as string,
          userId: data?.user?.id
        }),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pin', id] });
          setInput('');
        }
      });
    const handleAddComment = () => {
        if (input.trim() === '') return;
        mutate();
      };
  return (
    <div className="border-t pt-4 w-full">
            
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                className="border rounded-full px-3 py-1 flex-1 text-sm w-full"
                placeholder="Add a comment..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-3 py-1 cursor-pointer rounded-full text-sm"
                onClick={handleAddComment}
              >
                Post
              </button>
            </div>
          </div>
  )
}

export default CommentForm