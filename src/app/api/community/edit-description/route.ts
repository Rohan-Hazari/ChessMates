import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = CommunityValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "Not logged in",
      });
    }

    const communityExists = await db.community.findFirst({
      where: {
        name,
      },
    });

    if (!communityExists) {
      return new Response("Community does not exist", { status: 404 });
    }

    if (communityExists.creatorId !== session.user.id) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "You are not the creator of this community",
      });
    }

    if (description.length > 500) {
      return new Response("Description exceeds the character limit of 500", {
        status: 422,
        statusText: "Description too long",
      });
    }

    const community = await db.community.update({
      where: {
        name,
      },
      data: {
        description,
      },
    });

    return new Response(community.name, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Could not update the description, please try again later",
      { status: 500 }
    );
  }
}
