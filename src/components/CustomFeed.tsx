import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/lib/auth"


const wait = (ms: number) => { return new Promise((res) => setTimeout(res, ms)) }

const CustomFeed = async () => {

    // await wait(10000)

    const session = await getAuthSession()

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user.id
        },
        include: {
            community: true
        }
    })


    const posts = await db.post.findMany({
        where: {
            community: {
                name: {
                    in: followedCommunities.map(({ community }) => community.id),
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },

        include: {
            votes: true,
            author: true,
            comments: true,
            community: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
    })

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed