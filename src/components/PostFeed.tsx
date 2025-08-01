"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks"; // https://mantine.dev/hooks/use-intersection/
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { FeedSkeletonLoading } from "./Loaders/Feed";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
  noSubscriptions?: boolean;
}

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  communityName,
  noSubscriptions,
}) => {
  const { data: session, status } = useSession();
  const lastPostRef = useRef<HTMLElement>(null);

  const safeInitialPosts = initialPosts ?? [];
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useInfiniteQuery(
      // unique key
      ["infinite-query"],

      // function called each time a new page of data is needed
      async ({ pageParam = 1 }) => {
        if (pageParam === 1 && safeInitialPosts.length > 0) {
          return safeInitialPosts;
        }
        const query =
          `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULT}&page=${pageParam}` +
          (!!communityName
            ? `&communityName=${communityName}`
            : `&communityName=community`);

        const { data } = await axios.get(query);

        return data as ExtendedPost[];
      },
      // options
      {
        //   function to determine pageParam for nextPage
        getNextPageParam: (lastPages, pages) => {
          if (lastPages.length < INFINITE_SCROLLING_PAGINATION_RESULT) {
            // this means no next page available
            return undefined;
          }
          // current number of pages + 1
          return pages.length + 1;
        },
        initialData: { pages: [safeInitialPosts], pageParams: [1] },
        enabled: safeInitialPosts.length === 0,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? safeInitialPosts;
  if (status === "loading") return null;

  // if (safeInitialPosts.length < 1) return renderNoMorePosts();

  return (
    <div className="flex flex-col col-span-2 space-y-6">
      <DndProvider backend={HTML5Backend}>
        {posts.map((post, index) => {
          const votesAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);

          // current vote is whether user has clicked UP or DOWN
          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
          );
          // is current post the last one in posts array
          if (index === posts.length - 1) {
            return (
              <div key={post.id} ref={ref}>
                <Post
                  commentAmt={post.comments.length}
                  post={post}
                  communityName={post.community.name}
                  votesAmt={votesAmount}
                  currentVote={currentVote}
                />
              </div>
            );
          } else {
            return (
              <Post
                commentAmt={post.comments.length}
                key={post.id}
                post={post}
                communityName={post.community.name}
                votesAmt={votesAmount}
                currentVote={currentVote}
              />
            );
          }
        })}
        {(isFetchingNextPage || isLoading) && (
          <div className="left-1/2 flex justify-center items-center bg-gradient-to-b from-transparent to-white  text-amber-500">
            <FeedSkeletonLoading />
          </div>
        )}
        {!hasNextPage && !isFetchingNextPage && renderNoMorePosts()}
      </DndProvider>
    </div>
  );
};

const renderNoMorePosts = () => {
  return (
    <div className="flex flex-col justify-center text-zinc-600">
      <p className="text-center">No more posts to load :/</p>
      <p className="text-center text-orange-500 font-semibold">
        Explore and subscribe to communities to see more posts
      </p>
    </div>
  );
};

export default PostFeed;
