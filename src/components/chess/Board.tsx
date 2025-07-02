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
  const [moveSquares, setMoveSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const safeGameMutate = (modify: (game: Chess) => void) => {
    setGame((g) => {
      const update = g;
      modify(update);
      return update;
    });
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
  const makeRandomMove = () => {
    const possibleMoves = game.moves();
    console.log(game.ascii());

    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    console.log(possibleMoves, randomIndex);
    safeGameMutate((game: Chess) => {
      game.move(possibleMoves[randomIndex]);
    });
  };
  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
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
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGame(gameCopy);
      // setTimeout(makeRandomMove, 300);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }
  function onPromotionPieceSelect(piece?: string) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move({
        from: moveFrom as Square,
        to: moveTo as Square,
        promotion: piece ?? "q",
      });
      setGame(gameCopy);
      // setTimeout(makeRandomMove, 300);
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
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          promotionToSquare={moveTo}
          showPromotionDialog={showPromotionDialog}
        />
      </div>
      <div className="w-full mt-2 flex justify-center sm:justify-start gap-x-6 ">
        <Button
          onClick={() => {
            safeGameMutate((game) => {
              game.undo();
            });
          }}
        >
          Back
        </Button>
        <Button onClick={() => setGame(new Chess(normalisedFen))}>Reset</Button>
        <Button>Forward</Button>
      </div>
      {/* <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game:Chess) => {
            game.reset();
          });
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        undo
      </button> */}
    </div>
  );
};

export default Board;
