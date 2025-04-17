import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
const CreateComment = dynamic(() => import("./CreateComment"), { ssr: false });
const CommentsContainer = dynamic(() => import("./CommentsContainer"), {
  ssr: false,
});
interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      author: true,
      votes: true,
      // the reply to top comment, only goes 1 level deep
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4 justify-center ">
        {/* this takes comments that are only top level and omits replies by checking replyid is false */}
        {comments.length > 0 ? (
          comments
            .filter((comment) => !comment.replytoId)
            .map((topComment) => {
              const topCommentVotesAmt = topComment.votes.reduce(
                (acc, vote) => {
                  if (vote.type === "UP") return acc + 1;
                  if (vote.type === "DOWN") return acc - 1;
                  return acc;
                },
                0
              );

              const topCommentVote = topComment.votes.find(
                (vote) => vote.userId === session?.user.id
              );

              return (
                <div key={topComment.id} className="flex flex-col">
                  <CommentsContainer
                    topComment={topComment}
                    topCommentVote={topCommentVote}
                    topCommentVotesAmt={topCommentVotesAmt}
                    postId={postId}
                  />
                </div>
              );
            })
        ) : (
          <p className="text-center text-zinc-400">
            No comments yet. Be the first to comment
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
