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
import { Info,Undo,Redo,RefreshCcw } from "lucide-react";

interface BoardProps {
  fen: string | null;
  solution?: string[];
}

const Board: FC<BoardProps> = ({ fen, solution }) => {
  const normalisedFen = normaliseFEN(fen ?? defaultFEN);
  const [game, setGame] = useState(new Chess(normalisedFen));

  // --- State for manual play ---
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>({});
  const [pastMoves, setPastMoves] = useState<Move[]>([]);
  const [futureMoves, setFutureMoves] = useState<Move[]>([]);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  
  // --- State for visual feedback ---
  const [moveStatus, setMoveStatus] = useState<SquareStyles>({});

  // --- State for puzzle solving ---
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [finalMoveSquare, setFinalMoveSquare] = useState<Square | null>(null);

  // A puzzle is interactive only if a valid solution array is passed
  const isPlayablePuzzle = solution && solution.length > 0;

  // --- Handlers for Manual and Puzzle Play ---

  const applyNewMoveToGame = (move: Move) => {
    setGame((prevGame) => {
      const newGameInstance = new Chess(prevGame.fen());
      newGameInstance.move(move);
      return newGameInstance;
    });

    const newPastMoves = [...pastMoves, move];
    setPastMoves(newPastMoves);
    setFutureMoves([]);

    // Only flash green for correct moves in puzzle mode
    if (isPlayablePuzzle) {
      setMoveStatus({ [move.to]: { backgroundColor: 'rgba(46, 204, 113, 0.5)' } });
      setTimeout(() => setMoveStatus({}), 300);
    }

    // Check if the puzzle is solved
    if (isPlayablePuzzle && solution && newPastMoves.length === solution.length) {
      setIsPuzzleSolved(true);
      setFinalMoveSquare(move.to); // Store the final square
    }
  };

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: SquareStyles = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(square) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };
    setOptionSquares(newSquares);
    return true;
  };

  function onSquareClick(square: Square) {
    setRightClickedSquares({});
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }
    if (moveFrom === square) {
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }
    const pieceOnClickedSquare = game.get(square);
    if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
      const hasMoveOptions = getMoveOptions(square);
      setMoveFrom(hasMoveOptions ? square : null);
      return;
    }
    const moves = game.moves({ square: moveFrom, verbose: true });
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);
    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square);
      setMoveFrom(hasMoveOptions ? square : null);
      return;
    }

    // --- Puzzle Move Validation ---
    if (isPlayablePuzzle && solution) {
      const tempGame = new Chess(game.fen());
      const moveResult = tempGame.move({ from: moveFrom, to: square, promotion: "q" });
      const expectedMove = solution[pastMoves.length];
      
      if (!moveResult || moveResult.san !== expectedMove) {
        // Flash red for incorrect move
        setMoveStatus({ [square]: { backgroundColor: 'rgba(231, 76, 60, 0.5)' } });
        setTimeout(() => setMoveStatus({}), 300);
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }
    }

    setMoveTo(square);
    if ((foundMove.color === "w" && foundMove.piece === "p" && square[1] === "8") || (foundMove.color === "b" && foundMove.piece === "p" && square[1] === "1")) {
      setShowPromotionDialog(true);
      return;
    }
    
    const tempGame = new Chess(game.fen());
    const resultMove = tempGame.move({ from: moveFrom, to: square, promotion: "q" });
    if (resultMove) {
      applyNewMoveToGame(resultMove);
    }
    setMoveFrom(null);
    setMoveTo(null);
    setOptionSquares({});
  }

  function onPromotionPieceSelect(piece?: string) {
    if (piece) {
      const tempGame = new Chess(game.fen());
      const resultMove = tempGame.move({ from: moveFrom as Square, to: moveTo as Square, promotion: piece ?? "q" });
      if (resultMove) applyNewMoveToGame(resultMove);
    }
    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({ ...rightClickedSquares, [square]: rightClickedSquares[square] && rightClickedSquares[square]!.backgroundColor === colour ? undefined : { backgroundColor: colour } });
  }

  const handleUndo = () => {
    if (pastMoves.length > 0) {
      const lastMove = pastMoves[pastMoves.length - 1];
      const newPastMoves = pastMoves.slice(0, pastMoves.length - 1);
      const tempGame = new Chess(normalisedFen);
      newPastMoves.forEach((move) => tempGame.move(move));
      setGame(tempGame);
      setPastMoves(newPastMoves);
      setFutureMoves((prev) => [lastMove, ...prev]);
      setIsPuzzleSolved(false);
      setFinalMoveSquare(null); // Clear final move square on undo
    }
  };

  const handleRedo = () => {
    
    if (futureMoves.length > 0) {
      const nextMove = futureMoves[0];
      const newFutureMoves = futureMoves.slice(1);
      const tempGame = new Chess(game.fen());
      tempGame.move(nextMove);
      setGame(tempGame);
      setPastMoves((prev) => [...prev, nextMove]);
      setFutureMoves(newFutureMoves);

      if (isPlayablePuzzle && solution && pastMoves.length + 1 === solution.length) {
        setIsPuzzleSolved(true);
        setFinalMoveSquare(nextMove.to); // Set final move square on redo
      }
    }
  };

  const handleReset = () => {
    setGame(new Chess(normalisedFen));
    setPastMoves([]);
    setFutureMoves([]);
    setIsPuzzleSolved(false);
    setFinalMoveSquare(null); // Clear final move square on reset
  };

  return (
    <div className="flex flex-col justify-center ">
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
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquareStyles={{
              ...optionSquares,
              ...rightClickedSquares,
              ...moveStatus,
            }}
            promotionToSquare={moveTo}
            showPromotionDialog={showPromotionDialog}
          />

        {isPuzzleSolved && finalMoveSquare && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              width: '12.5%', 
              height: '12.5%', 
              top: `${(8 - parseInt(finalMoveSquare[1])) * 12.5}%`,
              left: `${(finalMoveSquare.charCodeAt(0) - 'a'.charCodeAt(0)) * 12.5}%`,
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
        )}
      </div>

      <div className="w-full md:text-start text-center mt-4">
        {isPuzzleSolved ? (
          <div className="font-bold text-2xl text-green-600">
            Puzzle Solved!
            {game.isCheckmate() && <span className="block text-lg">Checkmate!</span>}
          </div>
        ) : (
          <p className="font-semibold text-lg text-zinc-600">
            {game.turn() === 'w' ? 'White to Move' : 'Black to Move'}
          </p>
        )}
      </div>

      <div className="w-full mt-2 flex justify-center md:justify-start gap-x-6 ">
        {isPlayablePuzzle ? (
          <>
            <Button onClick={handleUndo} >
              <Undo className="w-4 h-4 mr-2"/>Undo
            </Button>
            <Button onClick={handleReset}><RefreshCcw className="w-4 h-4 mr-2"/> Reset</Button>
            <Button onClick={handleRedo} >
              <Redo className="w-4 h-4 mr-2"/>Redo
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-zinc-500 italic">
            <p>This is a free-play board.</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Author did not provide any solution. Explore this position freely.</p>
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
