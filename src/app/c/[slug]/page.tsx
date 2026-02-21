import CreatePost from "@/components/CreatePost";
import { FeedSkeletonLoading } from "@/components/Loaders/Feed";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/Badge";

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
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!community) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-3xl md:text-4xl text-slate-900">
          c/{community.name}
        </h1>
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 border-amber-200"
        >
          Community
        </Badge>
      </div>
      <CreatePost session={session} />
      {/* Show posts in user feed */}
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
