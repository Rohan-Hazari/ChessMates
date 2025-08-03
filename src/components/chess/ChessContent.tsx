"use client"

import { formatPuzzleSolution, normaliseFEN } from "@/lib/utils";
import { Chess } from "chess.js";
import { FC, useMemo, useState } from "react";
import Board from "./Board";
import { Button } from "../ui/Button";
import { Post } from ".prisma/client";
import { defaultFEN } from "@/constants/board";



const ChessContent: FC<{ post: Post }> = ({ post }) => {
  const [isSolutionVisible, setSolutionVisible] = useState<boolean>(false);
  const { isPlayable, solutionMoves } = useMemo(() => {
    if (!post.boardSolution || !post.boardFen) {
      return { isPlayable: false, solutionMoves: [] };
    }

    const rawMoves = formatPuzzleSolution(post.boardSolution);
    const sanitizedMoves: string[] = [];
    const tempGame = new Chess(normaliseFEN(post.boardFen ?? defaultFEN));

    try {
      for (const move of rawMoves) {
        const sanitizedMove = move.replace(/^\d+\.?\s*/, '');
        
        if (tempGame.move(sanitizedMove) === null) {
          return { isPlayable: false, solutionMoves: rawMoves };
        }
        sanitizedMoves.push(sanitizedMove);
      }
    } catch (error) {
      return { isPlayable: false, solutionMoves: rawMoves };
    }
    
 
    return { isPlayable: true, solutionMoves: sanitizedMoves }; 
  }, [post.boardSolution, post.boardFen]);

  return (
    <>
      <Board
        solution={isPlayable ? solutionMoves : undefined}
        fen={post.boardFen}
      />
      
      {/* Logic for showing a non-playable solution */}
      {!isPlayable && post.boardSolution && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setSolutionVisible((prev) => !prev)}
          >
            {isSolutionVisible ? "Hide Solution" : "View Solution"}
          </Button>
          {isSolutionVisible && (
             <p className="mt-2 p-2 bg-zinc-100 rounded-md text-sm text-zinc-700 font-mono">
               {post.boardSolution}
             </p>
          )}
        </div>
      )}
    </>
  );
};

export default ChessContent