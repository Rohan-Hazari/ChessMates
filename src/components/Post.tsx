"use client";
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef, useState } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import ChessPostBoard from "./chess/ChessPostBoard";
import ValidChessBoard from "./chess/ValidChessBoard";
import { Button } from "./ui/Button";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  communityName: string;
  post: Post & { author: User; votes: Vote[] };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  communityName,
  post,
  commentAmt,
  votesAmt,
  currentVote,
}) => {
  // to track posts height
  const pRef = useRef<HTMLDivElement>(null);
  const isPostTypeChess = post.postType === "chess";
  const [isSolutionVisible, setSolutionVisible] = useState<boolean>(false);

  return (
    <div className="rounded-md bg-white shadow">
      <div className=" px-2 sm:px-2 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {communityName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/c/${communityName}`}
                >
                  c/{communityName}
                </a>
                <span className="px-1">●</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          {/* a tag to hard refresh the comments */}
          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className={`relative text-sm max-h-[${
              isPostTypeChess ? "520px" : "420px"
            }] w-full overflow-clip`}
            ref={pRef}
          >
            {isPostTypeChess ? (
              <ChessPostBoard
                boardSolution={post.boardSolution}
                fen={post.boardFen}
              />
            ) : (
              <EditorOutput content={post.content} />
            )}
            {post.boardSolution && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  className="focus:ring-0"
                  onClick={() => setSolutionVisible((prev) => !prev)}
                >
                  {" "}
                  View solution{" "}
                </Button>
                <div className={isSolutionVisible ? "block" : "hidden"}>
                  {post.boardSolution}
                </div>
              </div>
            )}
            {pRef.current?.clientHeight === 520 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <a
          className="w-fit flex items-center gap-2"
          href={`/c/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

export default Post;
