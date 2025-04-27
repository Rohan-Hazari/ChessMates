import { db } from "@/lib/db";
import { CronPuzzleValidator } from "@/lib/validators/cron-puzzle";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const { fen, title, theme, solution, mate_in_n, hint, difficulty } =
      CronPuzzleValidator.parse(body);

    const puzzle = await db.dailyPuzzle.create({
      data: {
        title,
        fen,
        difficulty,
        hint,
        mateInN: mate_in_n,
        solution,
        theme,
        createdAt: new Date(),
      },
    });
    return new Response(puzzle.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Validation error", issues: error.errors }),
        {
          status: 422,
        }
      );
    }

    return new Response("Could not post, please try again later", {
      status: 500,
    });
  }
}
