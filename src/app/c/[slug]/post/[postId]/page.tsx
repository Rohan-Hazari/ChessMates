import CommentsSection from '@/components/CommentsSection'
import EditorOutput from '@/components/EditorOutput'
import ChessPostBoard from '@/components/chess/ChessPostBoard'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'


interface pageProps {
    params: {
        postId: string
    }

}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }: pageProps) => {
    let cachedPost;
    let post: (Post & { votes: Vote[]; author: User }) | null = null
    try {
        cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost
        if (!cachedPost) {
            post = await db.post.findFirst({
                where: {
                    id: params.postId,
                },
                include: {
                    votes: true,
                    author: true,
                }
            })

        }
    } catch (error) {
        toast({ title: 'Server error', description: 'Something went wrong,please try again later', variant: 'destructive' })
    }

    // if it not cached then call from database
    const getData = async () => {
        try {
            return await db.post.findUnique({
                where: {
                    id: params.postId
                },
                include: {
                    votes: true
                }
            })
        } catch (error) {
            console.log(error);

        }
    }

    if (!post && !cachedPost) return notFound()

    return <div>
        <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
            {/* votes and comments will be dynamically streamed in while the crucial content will be shown immediately */}
            <Suspense fallback={<PostVoteSkeleton />} >
                {/* @ts-expect-error server component */}
                <PostVoteServer postId={post?.id ?? cachedPost.id} getData={getData} />
            </Suspense>
            <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
                <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                    Posted by u/{post?.author.name ?? cachedPost?.name}
                    {formatTimeToNow(new Date(post?.createdAt ?? cachedPost?.createdAt ?? ''))}
                </p>
                <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                    {post?.title ?? cachedPost?.title}
                </h1>

                {post?.postType === 'chess' ? (<ChessPostBoard boardSolution={post.boardSolution} fen={post.boardFen} />) : (<EditorOutput content={post?.content ?? cachedPost?.content} />)}

                <Suspense
                    fallback={
                        <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
                    }>
                    {/* @ts-expect-error Server Component */}
                    <CommentsSection postId={post?.id ?? cachedPost?.id} />
                </Suspense>

            </div>
        </div>
    </div>
}

function PostVoteSkeleton() {
    return (
        <div className='flex items-center flex-col pr-6 w-20'>

            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigUp className='h-5 w-5 text-zinc-700' />
            </div>
            <div className='text-center py-2 font-medium text-sm text-zinc-900'>
                <Loader2 className='h-3 w-3 animate-spin' />
            </div>
            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigDown className='h-5 w-5 text-zinc-700' />
            </div>
        </div>
    )
}
export default page