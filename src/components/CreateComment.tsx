'use client'
import { FC, useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/TextArea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  postId: string,
  replytoId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replytoId }) => {
  const [input, setInput] = useState<string>('')
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: Comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replytoId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replytoId,
      }
      const { data } = await axios.patch(`/api/community/post/comment`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        if (err.response?.status === 400) {
          return toast({
            title: "Not subscribed",
            description: "You are not subscribed to this community",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "An error occured",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.refresh()
      setInput('')
    }
  })


  return <div className='grid w-full gap-1.5'>
    <Label htmlFor='comment'>Your comment</Label>
    <div className='mt-2'>
      <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder='Add a comment...' />
      <div className='mt-2 flex justify-end'>
        <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => Comment({ postId, text: input, replytoId })}>Post</Button>
      </div>
    </div>
  </div>
}

export default CreateComment