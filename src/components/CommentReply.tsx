'use client'

import { Comment, CommentVote, User } from "@prisma/client"
import PostComment from "./PostComment"
import { useSession } from "next-auth/react"

type Replies = Comment & {
    votes: CommentVote[]
    author: User
}

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
    replies: Replies[]
}

interface CommentReplyProps {
    topComment: ExtendedComment
    postId: string

}

const CommentReply = ({ topComment, postId }: CommentReplyProps) => {
    const { data: session } = useSession()
    return <div>{topComment.replies.sort((a, b) => b.votes.length - a.votes.length).map((reply) => {
        const replyVotesAmt = reply.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)
        return <div key={reply.id} className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
            <PostComment
                isTopComment={false}
                comment={reply}
                currentVote={replyVote}
                votesAmt={replyVotesAmt}
                postId={postId}
            />
        </div>
    })}</div>
}

export default CommentReply