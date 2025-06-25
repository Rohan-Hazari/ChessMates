import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 3;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const existingVote = post.votes.find(
      (vote) => vote.userId === session.user.id
    );

    //  unselect the existing vote and update the new vote
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
      }
    } else {
      await db.vote.upsert({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
        update: {
          type: voteType,
        },
        create: {
          type: voteType,
          userId: session.user.id,
          postId,
        },
      });
    }

    const updatedPost = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!updatedPost) {
      return new Response("Post not found after update", { status: 500 });
    }

    const votesAmt = updatedPost.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorId: updatedPost.author.id ?? "",
        authorUsername: updatedPost.author.name ?? "",
        content: JSON.stringify(updatedPost.content),
        id: updatedPost.id,
        title: updatedPost.title,
        createdAt: updatedPost.createdAt,
        ...(updatedPost.postType && { postType: updatedPost.postType }),
        ...(updatedPost.boardFen && { boardFen: updatedPost.boardFen }),
        ...(updatedPost.gamePGN && { gamePGN: updatedPost.gamePGN }),
      };
      await redis.hset(`post:${postId}`, cachePayload);
    } else {
      await redis.del(`post:${postId}`);
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data ", { status: 422 });
    }

    return new Response("Could not register your vote ", {
      status: 500,
    });
  }
}
