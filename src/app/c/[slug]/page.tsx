import { FC } from "react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { notFound } from "next/navigation";
import CreatePost from "@/components/CreatePost";

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

        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!community) {
    return notFound();
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">{community.name}</h1>
      <CreatePost session={session} />
      {/* Show posts in user feed */}
    </>
  );
};

export default page;
