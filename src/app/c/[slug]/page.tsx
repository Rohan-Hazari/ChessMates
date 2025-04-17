import CreatePost from "@/components/CreatePost";
import { FeedSkeletonLoading } from "@/components/Loaders/Feed";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    // if u dont use include, community.post will return undefined due to performance reason
    // include basically fetches data from posts model which in turn fetches data from votes,comments,author,community model
    // computationally expensive, also known as N+1 problem
    // prisma handles this by batching these queries
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        //  limits how much rows to get
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!community) {
    notFound();
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        c/{community.name}
      </h1>
      <CreatePost session={session} />
      {/* Show posts in user feed  */}
      <Suspense fallback={<FeedSkeletonLoading />}>
        <PostFeed
          initialPosts={community.posts}
          communityName={community.name}
        />
      </Suspense>
    </>
  );
};

export default page;
