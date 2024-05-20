"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useRef } from "react";
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
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
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
        (!!communityName ? `&communityName=${communityName}` : ``);

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

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post />
            </li>
          );
        } else {
          return <Post />;
        }
      })}
    </ul>
  );
};

export default PostFeed;
