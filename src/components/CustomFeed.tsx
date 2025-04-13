import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
// import { getAuthSession } from "@/lib/auth";
import { getSessionFromRequest } from "@/lib/session";

const CustomFeed = async () => {
  // await wait(10000)

  const session = await getSessionFromRequest();
  let noSubscriptions = false;

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: true,
    },
  });

  if (followedCommunities.length < 1) {
    noSubscriptions = true;
  }

  const posts =
    followedCommunities.length < 1
      ? []
      : await db.post.findMany({
          where: {
            community: {
              name: {
                in: followedCommunities.map(({ community }) => community.id),
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },

          include: {
            votes: true,
            author: true,
            comments: true,
            community: true,
          },
          take: INFINITE_SCROLLING_PAGINATION_RESULT,
        });

  return <PostFeed initialPosts={posts} noSubscriptions={noSubscriptions} />;
};

export default CustomFeed;
