'use client'
import { Comment, CommentVote, User } from '@prisma/client'
import { FC, useState } from 'react'
import CommentReply from './CommentReply'
import PostComment from './PostComment'


type Replies = Comment & {
    votes: CommentVote[]
    author: User
}

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
    replies: Replies[]
}

interface CommentsContainerProps {
    topComment: ExtendedComment
    topCommentVotesAmt: number
    topCommentVote: CommentVote | undefined
    postId: string

}

const CommentsContainer: FC<CommentsContainerProps> = ({ topComment, topCommentVotesAmt, topCommentVote, postId, }) => {
    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false)
    return <div>
        <div className='mb-2'>
            <PostComment isTopComment={true} setIsReplyOpen={setIsReplyOpen} comment={topComment} currentVote={topCommentVote}
                votesAmt={topCommentVotesAmt} postId={postId} />
        </div>
        {isReplyOpen && <CommentReply topComment={topComment} postId={postId} />}
    </div>
}

export default CommentsContainer