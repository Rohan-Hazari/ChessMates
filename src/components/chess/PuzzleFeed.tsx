"use client";
import { DailyPuzzle } from "@prisma/client";
import { FC } from "react";
import DailyPuzzlePost from "./DailyPuzzle";

interface PuzzleFeedProps {
  puzzles: DailyPuzzle[];
}

const PuzzleFeed: FC<PuzzleFeedProps> = ({ puzzles }) => {
  if (puzzles && puzzles.length === 0)
    return <p>No puzzles added yet, come back after some time</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-green-500 h-3 w-3 rounded-full mr-2"></span>
          Today&rsquo;s Puzzle
        </h2>
        <div className="border-2 border-green-500 rounded-lg p-2">
          <DailyPuzzlePost puzzle={puzzles[0]} isHighlighted={true} />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Previous Puzzles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzles.slice(1).map((puzzle: DailyPuzzle) => {
          return (
            <div key={puzzle.id}>
              <DailyPuzzlePost puzzle={puzzle} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PuzzleFeed;
