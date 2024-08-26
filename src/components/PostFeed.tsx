"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks"; // https://mantine.dev/hooks/use-intersection/
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
  noSubscriptions?: boolean;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName, noSubscriptions }) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    // unique key
    ["infinite-query"],

    // function called each time a new page of data is needed
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULT}&page=${pageParam}` +
        (!!communityName ? `&communityName=${communityName}` : `&communityName=community`);

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    // options
    {
      //   function to determine pageParam for nextPage
      getNextPageParam: (_, pages) => {
        // current number of pages + 1
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <div className="flex flex-col col-span-2 space-y-6">
      {posts.length === 0 && <p className=" font-semibold text-center">No posts found X_X</p>}
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
      {noSubscriptions ? (<p className="text-orange-500 font-semibold text-center" >Explore and subscribe to communities to see more posts </p>) : null}
    </div>
  );
};

export default PostFeed;
