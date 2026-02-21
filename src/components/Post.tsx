"use client";
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import ChessContent from "./chess/ChessContent";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  communityName: string;
  post: Post & { author: User; votes: Vote[] };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const ContentPost: FC<PostProps> = ({
  communityName,
  post,
  commentAmt,
  votesAmt,
  currentVote,
}) => {
  const pRef = useRef<HTMLDivElement>(null);
  const isPostTypeChess = post.postType === "chess";

  return (
    <div className="group rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="px-3 sm:px-4 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-slate-500 flex items-center flex-wrap gap-1">
            {communityName ? (
              <>
                <a
                  className="font-semibold text-slate-700 hover:text-amber-600 transition-colors text-sm"
                  href={`/c/${communityName}`}
                >
                  c/{communityName}
                </a>
                <span className="text-slate-300">·</span>
              </>
            ) : null}
            <span>
              Posted by{" "}
              <span className="font-medium text-slate-600">
                u/{post.author.name}
              </span>
            </span>
            <span className="text-slate-300">·</span>
            <span>{formatTimeToNow(new Date(post.createdAt))}</span>
          </div>
          {/* a tag to hard refresh the comments */}
          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-slate-900 group-hover:text-amber-700 transition-colors">
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
              <ChessContent post={post} />
            ) : (
              <EditorOutput content={post.content} />
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 text-sm px-4 sm:px-6 py-3">
        <a
          className="w-fit flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors"
          href={`/c/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

export default ContentPost;