import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
