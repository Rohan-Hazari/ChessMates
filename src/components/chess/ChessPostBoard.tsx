"use client";

import { convertFENToBoard } from "@/lib/utils";
import { Board, Piece, PieceItem, Position } from "@/types/board";
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ChessPostBoardProps {
  fen: string | null;
  boardSolution: string | null;
}

const pieceComponents = {
  K: () => <span className="text-4xl">♔</span>,
  Q: () => <span className="text-4xl">♕</span>,
  R: () => <span className="text-4xl">♖</span>,
  B: () => <span className="text-4xl">♗</span>,
  N: () => <span className="text-4xl">♘</span>,
  P: () => <span className="text-4xl">♙</span>,
  k: () => <span className="text-4xl text-primary">♚</span>,
  q: () => <span className="text-4xl text-primary">♛</span>,
  r: () => <span className="text-4xl text-primary">♜</span>,
  b: () => <span className="text-4xl text-primary">♝</span>,
  n: () => <span className="text-4xl text-primary">♞</span>,
  p: () => <span className="text-4xl text-primary">♟</span>,
};

const ChessPostBoard = ({ fen, boardSolution }: ChessPostBoardProps) => {
  const piecePlacement = fen?.trim().split(/\s+/)[0];
  const boardFEN = piecePlacement ?? "";
  const givenBoard = convertFENToBoard(boardFEN);
  const [board, setBoard] = useState<Board>(
    givenBoard ?? [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ]
  );

  const handleDrop = (item: PieceItem, newPosition: Position) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);

      // Remove the piece from its original position if it was on the board

      let pieceToMove = item.piece;

      // If the piece is coming from the board, use the current board state
      if (item.position) {
        const [oldRow, oldCol] = item.position;
        pieceToMove = prevBoard[oldRow][oldCol];
        newBoard[oldRow][oldCol] = "";
      }

      // Place the piece in the new position if it's on the board
      if (newPosition) {
        const [newRow, newCol] = newPosition;
        newBoard[newRow][newCol] = pieceToMove;
      }

      return newBoard;
    });
  };

  return (
    <div className="flex items-start">
      <Chessboard
        board={board}
        onDrop={handleDrop}
        givenBoard={givenBoard}
        boardSolution={boardSolution}
        setBoard={setBoard}
      />
    </div>
  );
};

interface ChessboardProps {
  board: Board;
  onDrop: (item: PieceItem, position: Position) => void;
  givenBoard: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  boardSolution: string | null;
}

const Chessboard = ({
  board,
  onDrop,
  givenBoard,
  setBoard,
  boardSolution,
}: ChessboardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="inline-grid grid-cols-8 border-2 border-gray-800">
        {board.map((row, i) =>
          row.map((piece, j) => (
            <Square
              key={`${i}-${j}`}
              position={[i, j]}
              piece={piece}
              onDrop={onDrop}
            />
          ))
        )}
      </div>
      <ChessControls givenBoard={givenBoard} setBoard={setBoard} />
    </div>
  );
};

interface ChessControlsProps {
  givenBoard: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
}

const ChessControls = ({ givenBoard, setBoard }: ChessControlsProps) => {
  return (
    <div className="w-full flex justify-evenly ">
      <button>Back</button>
      <button onClick={() => setBoard(givenBoard)}>Reset</button>
      <button>Forward</button>
    </div>
  );
};

const ChessPiece = ({
  piece,
  position,
}: {
  piece: Piece;
  position: Position;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { piece, position } as PieceItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const PieceComponent = pieceComponents[piece as keyof typeof pieceComponents];

  return (
    <div
      ref={drag}
      className="w-full h-full flex items-center justify-center hover:cursor-grab cursor-grabbing"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <PieceComponent />
    </div>
  );
};

const Square = ({
  position,
  piece,
  onDrop,
}: {
  position: Position;
  piece: Piece;
  onDrop: (item: PieceItem, position: Position) => void;
}) => {
  const [, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item: PieceItem) => onDrop(item, position),
  }));

  const isBlack = position && (position[0] + position[1]) % 2 === 1;

  const row = position && position[0];
  const col = position && position[1];
  const isLastRow = row === 7;
  const isLastColumn = col === 7;

  const fileNotation =
    isLastRow && col !== null ? String.fromCharCode(97 + col) : "";
  const rankNotation = isLastColumn && row !== null ? String(8 - row) : "";

  return (
    <div
      ref={drop}
      className={`w-8 h-8 sm:w-12 sm:h-12 ${
        isBlack ? "bg-[#b58863]" : "bg-[#f0d9b5]"
      } flex items-center justify-center relative`}
    >
      {fileNotation && (
        <div
          className={`absolute bottom-0 left-0 text-xs  ${
            isBlack ? "text-white" : "text-black"
          }`}
        >
          {fileNotation}
        </div>
      )}
      {rankNotation && (
        <div
          className={`absolute top-0 right-0 text-xs ${
            isBlack ? "text-white" : "text-black"
          }`}
        >
          {rankNotation}
        </div>
      )}

      {piece && <ChessPiece piece={piece} position={position} />}
    </div>
  );
};

export default ChessPostBoard;
