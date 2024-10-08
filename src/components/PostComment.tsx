'use client'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { formatTimeToNow } from '@/lib/utils'
import { CommentRequest } from '@/lib/validators/comment'
import { Comment, CommentVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { MessageSquare, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useRef, useState } from 'react'
import CommentVotes from './CommentVotes'
import UserAvatar from './UserAvatar'
import { Button } from './ui/Button'
import { Label } from './ui/Label'
import { Textarea } from './ui/TextArea'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'




type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
    votesAmt: number
    currentVote: CommentVote | undefined
    postId: string
    isTopComment: boolean
    setIsReplyOpen?: React.Dispatch<React.SetStateAction<boolean>>

}

const PostComment: FC<PostCommentProps> = ({
    comment,
    votesAmt,
    currentVote,
    postId,
    isTopComment,
    setIsReplyOpen

}) => {
    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const commentRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState<string>(`@${comment.author.name} `)
    const router = useRouter()
    const [isLoading, setLoading] = useState<boolean>(false)
    const { loginToast } = useCustomToast()
    useOnClickOutside(commentRef, () => {
        setIsReplying(false)
    })

    const { mutate: postComment } = useMutation({
        mutationFn: async ({ postId, text, replytoId }: CommentRequest) => {
            const payload: CommentRequest = { postId, text, replytoId }
            setLoading(true)

            const { data } = await axios.patch(
                `/api/community/post/comment/`,
                payload
            )
            return data
        },

        onError: () => {
            return toast({
                title: 'Something went wrong.',
                description: "Comment wasn't created successfully. Please try again.",
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            router.refresh()
            setIsReplying(false)
        },
        onSettled: () => {
            setLoading(false)
        }
    })

    return (
        <div ref={commentRef} className='flex flex-col'>
            <div className='flex items-center'>
                <UserAvatar
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null,
                    }}
                    className='h-6 w-6'
                />
                <div className='ml-2 flex items-center gap-x-2'>
                    <p className='text-sm font-medium text-gray-900'>{comment.author.name}</p>

                    <p className='max-h-40 truncate text-xs text-zinc-500'>
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>

            <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>

            <div className='flex gap-2 items-center'>
                <CommentVotes
                    commentId={comment.id}
                    initialVotesAmt={votesAmt}
                    initialVote={currentVote}
                />

                <Button
                    onClick={() => {
                        if (!session) return loginToast()
                        setIsReplying(true)
                    }}
                    variant='ghost'
                    size='xs'>
                    <MessageSquare className='h-4 w-4 mr-1.5' />
                    Reply
                </Button>

                {isTopComment && (<Button
                    onClick={() => {
                        setIsReplyOpen?.((prev) => !prev)
                    }}
                    variant='subtle'
                    size='xs'>
                    <ChevronDown className='h-4 w-4 mr-1.5' />
                    Replies
                </Button>)}
            </div>

            {isReplying ? (
                <div className='grid w-full gap-1.5'>
                    <Label htmlFor='comment'>Your comment</Label>
                    <div className='mt-2'>
                        <Textarea
                            onFocus={(e) =>
                                e.currentTarget.setSelectionRange(
                                    e.currentTarget.value.length,
                                    e.currentTarget.value.length
                                )
                            }
                            autoFocus
                            id='comment'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={1}
                            placeholder='What are your thoughts?'
                        />

                        <div className='mt-2 flex justify-end gap-2'>
                            <Button
                                tabIndex={-1}
                                variant='subtle'
                                onClick={() => setIsReplying(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading}
                                isLoading={isLoading}
                                onClick={() => {
                                    if (!input) return
                                    postComment({
                                        postId,
                                        text: input,
                                        replytoId: comment.replytoId ?? comment.id, // default to top-level comment
                                    })
                                }}>
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default PostComment