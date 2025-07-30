"use client";
import { DailyPuzzle } from "@prisma/client";
import { FC, useState, useEffect } from "react";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Badge } from "../ui/Badge";
import Board from "./Board";

interface DailyPuzzleProps {
  puzzle: DailyPuzzle;
  isHighlighted?: boolean;
}

const DailyPuzzlePost: FC<DailyPuzzleProps> = ({
  puzzle,
  isHighlighted = false,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [boardPosition, setBoardPosition] = useState(puzzle.fen);
  const isMobile = useMobile();

  useEffect(() => {
    try {
      setBoardPosition(puzzle.fen);
    } catch (error) {
      console.error("Error initializing chess game:", error);
    }
  }, [puzzle.fen]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className={cn("overflow-hidden", isHighlighted && "bg-green-50 p-4")}>
      {!isHighlighted && (
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{puzzle.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize text-sm">
                {puzzle.theme}
              </Badge>
              <Badge
                className={cn(
                  "text-white text-sm",
                  getDifficultyColor(puzzle.difficulty)
                )}
              >
                {puzzle.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4 pt-0">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="w-full flex flex-col items-center aspect-square max-w-[350px] mx-auto md:mx-0">
            <Board fen={boardPosition} />
          </div>
          <div>
            {isHighlighted && (
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{puzzle.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {puzzle.theme}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-white text-xs ",
                      getDifficultyColor(puzzle.difficulty)
                    )}
                  >
                    {puzzle.difficulty}
                  </Badge>
                </div>
              </div>
            )}
            {isHighlighted && (
              <div>
                {" "}
                <p className="text-sm text-gray-700 mt-4">
                  Hint :
                  <span className="blur-sm transition-all hover:blur-0">
                    {puzzle.hint}
                  </span>
                </p>
                <p className="text-sm font-medium mb-4">
                  Goal: Checkmate in {puzzle.mateInN}
                </p>
                {showSolution ? (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <h4 className="font-medium mb-2">Solution:</h4>
                    <p className="font-mono">{puzzle.solution}</p>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowSolution(true)}
                    variant="outline"
                  >
                    Show Solution
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-gray-500">
        Published: {formatDate(puzzle.publishedAt)}
      </CardFooter>
    </Card>
  );
};

export default DailyPuzzlePost;
