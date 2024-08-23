
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import dynamic from 'next/dynamic'
const CreateComment = dynamic(() => import('./CreateComment'), { ssr: false })
const PostComment = dynamic(() => import('./PostComment'), { ssr: false })
interface CommentsSectionProps {
  postId: string

}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany(({
    where: {
      postId,
      replyTo: null
    },
    include: {
      author: true,
      votes: true,
      // the reply to top comment, only goes 1 level deep
      replies: {
        include: {
          author: true,
          votes: true,
        }
      }
    }
  }))


  return <div className='flex flex-col gap-y-4 mt-4'>
    <hr className='w-full h-px my-6' />
    <CreateComment postId={postId} />

    <div className='flex flex-col gap-y-6 mt-4'>
      {comments.filter((comment) => !comment.replytoId).map((topComment) => {
        const topCommentVotesAmt = topComment.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const topCommentVote = topComment.votes.find((vote) => vote.userId === session?.user.id)

        return <div key={topComment.id} className='flex flex-col'>
          <div className='mb-2'>
            <PostComment comment={topComment} currentVote={topCommentVote}
              votesAmt={topCommentVotesAmt} postId={postId} />
          </div>

          {topComment.replies.sort((a, b) => b.votes.length - a.votes.length).map((reply) => {
            const replyVotesAmt = reply.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)

            const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)
            return <div key={reply.id} className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
              <PostComment
                comment={reply}
                currentVote={replyVote}
                votesAmt={replyVotesAmt}
                postId={postId}
              />
            </div>
          })}
        </div>
      })}
    </div>
  </div>
}

export default CommentsSection