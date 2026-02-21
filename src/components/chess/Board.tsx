"use client";
import { SquareStyles } from "@/types/board";
import { Chess, Move, Square } from "chess.js";
import { FC, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "../ui/Button";
import { defaultFEN } from "@/constants/board";
import { normaliseFEN, cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Info, Undo, Redo, RefreshCcw, Check } from "lucide-react";

interface BoardProps {
  fen: string | null;
  solution?: string[];
}

// Style constants
const CORRECT_MOVE_STYLE = { backgroundColor: "rgba(46, 204, 113, 0.5)" };
const INCORRECT_MOVE_STYLE = { backgroundColor: "rgba(231, 76, 60, 0.5)" };
const SELECTED_SQUARE_STYLE = { background: "rgba(255, 255, 0, 0.4)" };
const HIGHLIGHT_DURATION_MS = 300;

const CAPTURE_DOT =
  "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)";
const MOVE_DOT =
  "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)";

const Board: FC<BoardProps> = ({ fen, solution }) => {
  const normalisedFen = normaliseFEN(fen ?? defaultFEN);
  const [game, setGame] = useState(new Chess(normalisedFen));

  // Manual play state
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>(
    {}
  );
  const [pastMoves, setPastMoves] = useState<Move[]>([]);
  const [futureMoves, setFutureMoves] = useState<Move[]>([]);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  // Visual feedback state
  const [moveStatus, setMoveStatus] = useState<SquareStyles>({});

  // Puzzle solving state
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [finalMoveSquare, setFinalMoveSquare] = useState<Square | null>(null);

  // A puzzle is interactive only if a valid solution array is passed
  const isPlayablePuzzle = solution && solution.length > 0;

  // --- Core Helpers ---

  const flashSquare = (square: Square, style: SquareStyles[string]) => {
    setMoveStatus({ [square]: style });
    setTimeout(() => setMoveStatus({}), HIGHLIGHT_DURATION_MS);
  };

  const applyNewMoveToGame = (move: Move) => {
    setGame((prev) => {
      const next = new Chess(prev.fen());
      next.move(move);
      return next;
    });

    const newPastMoves = [...pastMoves, move];
    setPastMoves(newPastMoves);
    setFutureMoves([]);

    // Flash green for correct puzzle moves
    if (isPlayablePuzzle) {
      flashSquare(move.to, CORRECT_MOVE_STYLE);
    }

    // Check if puzzle is solved
    if (
      isPlayablePuzzle &&
      solution &&
      newPastMoves.length === solution.length
    ) {
      setIsPuzzleSolved(true);
      setFinalMoveSquare(move.to);
    }
  };

  const getMoveOptions = (square: Square): boolean => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: SquareStyles = {};
    moves.forEach((move) => {
      const isCapture =
        game.get(move.to) &&
        game.get(square) &&
        game.get(move.to)!.color !== game.get(square)!.color;

      newSquares[move.to] = {
        background: isCapture ? CAPTURE_DOT : MOVE_DOT,
        borderRadius: "50%",
      };
    });

    newSquares[square] = SELECTED_SQUARE_STYLE;
    setOptionSquares(newSquares);
    return true;
  };

  const clearSelection = () => {
    setMoveFrom(null);
    setMoveTo(null);
    setOptionSquares({});
  };

  const isPromotionMove = (move: Move, targetSquare: string): boolean => {
    return (
      move.piece === "p" &&
      ((move.color === "w" && targetSquare[1] === "8") ||
        (move.color === "b" && targetSquare[1] === "1"))
    );
  };

  // --- Event Handlers ---

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    // No piece selected yet — try selecting one
    if (!moveFrom) {
      if (getMoveOptions(square)) setMoveFrom(square);
      return;
    }

    // Clicked the same square — deselect
    if (moveFrom === square) {
      clearSelection();
      return;
    }

    // Clicked a friendly piece — switch selection
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      const hasMoves = getMoveOptions(square);
      setMoveFrom(hasMoves ? square : null);
      return;
    }

    // Try to find a legal move from moveFrom → square
    const moves = game.moves({ square: moveFrom, verbose: true });
    const foundMove = moves.find(
      (m) => m.from === moveFrom && m.to === square
    );

    if (!foundMove) {
      const hasMoves = getMoveOptions(square);
      setMoveFrom(hasMoves ? square : null);
      return;
    }

    // Puzzle mode: validate move against solution
    if (isPlayablePuzzle && solution) {
      const tempGame = new Chess(game.fen());
      const moveResult = tempGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
      const expectedMove = solution[pastMoves.length];

      if (!moveResult || moveResult.san !== expectedMove) {
        flashSquare(square, INCORRECT_MOVE_STYLE);
        clearSelection();
        return;
      }
    }

    // Handle promotion
    setMoveTo(square);
    if (isPromotionMove(foundMove, square)) {
      setShowPromotionDialog(true);
      return;
    }

    // Execute the move
    const tempGame = new Chess(game.fen());
    const resultMove = tempGame.move({
      from: moveFrom,
      to: square,
      promotion: "q",
    });
    if (resultMove) applyNewMoveToGame(resultMove);

    clearSelection();
  }

  function onPromotionPieceSelect(piece?: string) {
    if (piece) {
      const tempGame = new Chess(game.fen());
      const resultMove = tempGame.move({
        from: moveFrom as Square,
        to: moveTo as Square,
        promotion: piece ?? "q",
      });
      if (resultMove) applyNewMoveToGame(resultMove);
    }
    clearSelection();
    setShowPromotionDialog(false);
    return true;
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square]?.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  // --- Undo / Redo / Reset ---

  const handleUndo = () => {
    if (pastMoves.length === 0) return;

    const lastMove = pastMoves[pastMoves.length - 1];
    const newPastMoves = pastMoves.slice(0, -1);
    const tempGame = new Chess(normalisedFen);
    newPastMoves.forEach((move) => tempGame.move(move));

    setGame(tempGame);
    setPastMoves(newPastMoves);
    setFutureMoves((prev) => [lastMove, ...prev]);
    setIsPuzzleSolved(false);
    setFinalMoveSquare(null);
  };

  const handleRedo = () => {
    if (futureMoves.length === 0) return;

    const nextMove = futureMoves[0];
    const newFutureMoves = futureMoves.slice(1);
    const tempGame = new Chess(game.fen());
    tempGame.move(nextMove);

    setGame(tempGame);
    setPastMoves((prev) => [...prev, nextMove]);
    setFutureMoves(newFutureMoves);

    if (
      isPlayablePuzzle &&
      solution &&
      pastMoves.length + 1 === solution.length
    ) {
      setIsPuzzleSolved(true);
      setFinalMoveSquare(nextMove.to);
    }
  };

  const handleReset = () => {
    setGame(new Chess(normalisedFen));
    setPastMoves([]);
    setFutureMoves([]);
    setIsPuzzleSolved(false);
    setFinalMoveSquare(null);
  };

  // --- Render ---

  /** Checkmark overlay for solved puzzles */
  const renderSolvedOverlay = () => {
    if (!isPuzzleSolved || !finalMoveSquare) return null;

    const col = finalMoveSquare.charCodeAt(0) - "a".charCodeAt(0);
    const row = 8 - parseInt(finalMoveSquare[1]);

    return (
      <div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          width: "12.5%",
          height: "12.5%",
          top: `${row * 12.5}%`,
          left: `${col * 12.5}%`,
        }}
      >
        <svg
          className="w-full h-full text-green-500 opacity-75 p-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 50 L40 70 L80 30"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Board */}
      <div className="relative aspect-square w-full max-w-[420px] m-auto md:m-0">
        <Chessboard
          id="InteractiveBoard"
          animationDuration={200}
          arePiecesDraggable={false}
          position={game.fen()}
          onSquareClick={isPuzzleSolved ? undefined : onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={onPromotionPieceSelect}
          customBoardStyle={{
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
          customSquareStyles={{
            ...optionSquares,
            ...rightClickedSquares,
            ...moveStatus,
          }}
          promotionToSquare={moveTo}
          showPromotionDialog={showPromotionDialog}
        />
        {renderSolvedOverlay()}
      </div>

      {/* Status Text */}
      <div className="w-full md:text-start text-center mt-4">
        {isPuzzleSolved ? (
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="bg-emerald-100 rounded-lg p-1.5">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-xl text-emerald-600">
                Puzzle Solved!
              </p>
              {game.isCheckmate() && (
                <p className="text-sm text-emerald-500">Checkmate!</p>
              )}
            </div>
          </div>
        ) : (
          <p className="font-semibold text-lg text-slate-600">
            {game.turn() === "w" ? "White to Move" : "Black to Move"}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="w-full mt-3 flex justify-center md:justify-start gap-2">
        {isPlayablePuzzle ? (
          <>
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50"
            >
              <Undo className="w-4 h-4 mr-1.5" />
              Undo
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50"
            >
              <RefreshCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
            <Button
              onClick={handleRedo}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50"
            >
              <Redo className="w-4 h-4 mr-1.5" />
              Redo
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-500 italic">
            <p>This is a free-play board.</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Author did not provide any solution. Explore this position
                    freely.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
