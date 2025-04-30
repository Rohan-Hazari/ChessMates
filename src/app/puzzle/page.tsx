import PuzzleFeed from "@/components/chess/PuzzleFeed";
import { INFINITE_SCROLLING_PAGINATION_NEWS_RESULT } from "@/config";
import { db } from "@/lib/db";

const page = async () => {
  const puzzle = await db.dailyPuzzle.findMany({
    orderBy: {
      publishedAt: "desc",
    },
    take: INFINITE_SCROLLING_PAGINATION_NEWS_RESULT,
  });
  return (
    <div className="mt-6">
      <PuzzleFeed puzzles={puzzle} />
    </div>
  );
};

export default page;
