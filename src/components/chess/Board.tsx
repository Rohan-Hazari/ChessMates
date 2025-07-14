"use client";
import { MoveInput, SquareStyles } from "@/types/board";
import { Chess, Move, Piece, Square } from "chess.js";
import { FC, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "../ui/Button";
import { defaultFEN } from "@/constants/board";
import { normaliseFEN } from "@/lib/utils";

interface BoardProps {
  fen: string | null;
}

const Board: FC<BoardProps> = ({ fen }) => {
  const normalisedFen = normaliseFEN(fen ?? defaultFEN);
  const [game, setGame] = useState(new Chess(normalisedFen));
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] =
    useState<boolean>(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>(
    {}
  );
  const [pastMoves, setPastMoves] = useState<Move[]>([]);
  const [futureMoves, setFutureMoves] = useState<Move[]>([]);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const applyNewMoveToGame = (move: Move) => {
    setGame((prevGame) => {
      const newGameInstance = new Chess(prevGame.fen());
      newGameInstance.move(move);
      return newGameInstance;
    });
    setPastMoves((prev) => {
      // If we make a new move from an undone state, clear future moves
      return [...prev, move];
    });
    setFutureMoves([]);
  };

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: SquareStyles = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(square) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  };

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      } else {
        setOptionSquares({});
      }
      return;
    }
    // clicks on the same piece again
    if (moveFrom === square) {
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }
    // clicked on same colors piece eg white clicks on another white piece
    const pieceOnClickedSquare = game.get(square);
    if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      } else {
        setMoveFrom(null);
        setOptionSquares({});
      }
      return;
    }

    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : null);
        setOptionSquares(hasMoveOptions ? optionSquares : {});
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const tempGame = new Chess(game.fen());
      const resultMove = tempGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (resultMove === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      applyNewMoveToGame(resultMove);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }
  function onPromotionPieceSelect(piece?: string) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const tempGame = new Chess(game.fen());
      const resultMove = tempGame.move({
        from: moveFrom as Square,
        to: moveTo as Square,
        promotion: piece ?? "q",
      });
      if (resultMove) {
        applyNewMoveToGame(resultMove);
      }
    }
    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }
  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]!.backgroundColor === colour
          ? undefined
          : {
              backgroundColor: colour,
            },
    });
  }

  const handleUndo = () => {
    if (pastMoves.length > 0) {
      const lastMove = pastMoves[pastMoves.length - 1];
      const newPastMoves = pastMoves.slice(0, pastMoves.length - 1);

      const tempGame = new Chess(normalisedFen);
      newPastMoves.forEach((move) => {
        tempGame.move(move);
      });

      setGame(tempGame);
      setPastMoves(newPastMoves);
      setFutureMoves((prev) => [lastMove, ...prev]);

      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      setRightClickedSquares({});
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

      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      setRightClickedSquares({});
    }
  };

  const handleReset = () => {
    setMoveFrom(null);
    setOptionSquares({});
    setGame(new Chess(normalisedFen));
  };

  return (
    <div className="flex flex-col justify-center ">
      <div className="max-h-[420px] h-fit max-w-[420px] m-auto md:m-0">
        <Chessboard
          id="ClickToMove"
          animationDuration={200}
          arePiecesDraggable={false}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={onPromotionPieceSelect}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customSquareStyles={{
            ...optionSquares,
            ...rightClickedSquares,
          }}
          promotionToSquare={moveTo}
          showPromotionDialog={showPromotionDialog}
        />
      </div>
      <div className="w-full mt-2 flex justify-center sm:justify-start gap-x-6 ">
        <Button onClick={handleUndo}>Back</Button>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleRedo}>Forward</Button>
      </div>
    </div>
  );
};

export default Board;
