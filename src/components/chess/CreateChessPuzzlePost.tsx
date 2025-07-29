"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import {
  cn,
  convertBoardToFEN,
  convertFENToBoard,
  formatPuzzleSolution,
  normaliseFEN,
} from "@/lib/utils";
import { ChessPostPayload } from "@/lib/validators/chesspost";
import { Board, Piece, PieceItem, Position } from "@/types/board";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Chess } from "chess.js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { z } from "zod";

const pieceImagePaths = {
  K: "/pieces/wK.svg",
  Q: "/pieces/wQ.svg",
  R: "/pieces/wR.svg",
  B: "/pieces/wB.svg",
  N: "/pieces/wN.svg",
  P: "/pieces/wP.svg",
  k: "/pieces/bK.svg",
  q: "/pieces/bQ.svg",
  r: "/pieces/bR.svg",
  b: "/pieces/bB.svg",
  n: "/pieces/bN.svg",
  p: "/pieces/bP.svg",
};

interface CreateChessPuzzlePostProps {
  fen: string;
  isSubscribed: boolean;
  communityId: string;
}

const CreateChessPuzzlePost = ({
  fen,
  isSubscribed,
  communityId,
}: CreateChessPuzzlePostProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boardSolution, setBoardSolution] = useState<string>("");
  const givenBoard = convertFENToBoard(fen);
  const [solutionError, setSolutionError] = useState<string | null>(null);
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

  const { loginToast } = useCustomToast();
  const router = useRouter();
  const pathname = usePathname();

  const handleDrop = (item: PieceItem, newPosition: Position) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);

      // Piece to be moved
      let pieceToMove = item.piece;

      // If the piece is coming from the board, remove it from its original position
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

  const handleRemovePiece = (item: PieceItem) => {
    if (item.position) {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        const [row, col] = item.position as [number, number];
        newBoard[row][col] = "";
        return newBoard;
      });
    }
  };

  const {
    mutate: handlePost,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (boardSolution.trim() === "") {
        throw new Error("Please provide the solution in SAN format.");
      }
      const fen = convertBoardToFEN(board);
      const moves = formatPuzzleSolution(boardSolution);
      const chess = new Chess(normaliseFEN(fen));
      for (const move of moves) {
        const result = chess.move(move);
        if (result === null) {
          throw new Error(
            `The move "${move}" is not a legal move. Please check your solution.`
          );
        }
      }
      const payload: ChessPostPayload = {
        title,
        description,
        communityId: communityId,
        boardFen: fen,
        boardSolution,
      };

      const res = await axios.post("/api/chess/puzzle", payload);
      return res.data;
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        return toast({
          title: "Invalid input",
          description: "Please check the inputs and try again",
          variant: "warning",
        });
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          if (error.response.statusText === "loginError") {
            return loginToast();
          } else {
            return toast({
              title: "Not Subscribed to the community",
              description: "Please join the community to post",
              variant: "warning",
            });
          }
        } else if (error.response?.status === 404) {
          return toast({
            title: "No such community exist",
            description: "Community not found",
            variant: "destructive",
          });
        } else {
          return toast({
            title: "Internal server error",
            description:
              "Something went wrong on our side, please try again later",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      toast({
        title: "Post succesfully",
        variant: "success",
      });

      setTimeout(() => {
        router.refresh();
      }, 500);
    },
  });

  useEffect(() => {
    if (
      error instanceof Error &&
      (error.message.includes("solution") || error.message.includes("move"))
    ) {
      setSolutionError(error.message);
    }
  }, [error]);

  return (
    <DndProvider backend={HTML5Backend} options={{ enableMouseEvents: true }}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Chess Post</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="mt-2">
            <Input
              placeholder="Title"
              value={title}
              id="title"
              className="text-4xl border-none ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 m-0 p-0 placeholder:text-2xl placeholder:font-semibold"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Textarea
              htmlFor="Description"
              placeholder="Description... "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-none ring-0 focus-visible:ring-0 m-0 p-0"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <Chessboard board={board} onDrop={handleDrop} />
              <DropZone onDrop={handleRemovePiece} />
            </div>
            <SidePanel />
          </div>
          <Textarea
            required
            htmlFor="Solution"
            placeholder="Example: 1.e4 e5 2.Nf3 Nc6 3.Bb5 Qxh7"
            value={boardSolution}
            onChange={(e) => {
              setBoardSolution(e.target.value);
              setSolutionError(null);
            }}
            className={cn("mt-4", {
              "border-destructive focus-visible:ring-destructive animate-shake ":
                solutionError,
            })}
          />
          {solutionError && (
            <p className="text-sm  text-red-500 mt-1">{solutionError}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            disabled={!isSubscribed || isLoading}
            onClick={() => handlePost()}
          >
            Post
          </Button>
        </CardFooter>
      </Card>
    </DndProvider>
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

  const imageUrl = pieceImagePaths[piece as keyof typeof pieceImagePaths];
  const pieceName = {
    K: "White King",
    Q: "White Queen",
    R: "White Rook",
    B: "White Bishop",
    N: "White Knight",
    P: "White Pawn",
    k: "Black King",
    q: "Black Queen",
    r: "Black Rook",
    b: "Black Bishop",
    n: "Black Knight",
    p: "Black Pawn",
    "": "",
  }[piece];

  if (!imageUrl) return null;

  return (
    <div className="w-full h-full p-1 flex items-center justify-center">
      <img
        ref={drag}
        src={imageUrl}
        alt={pieceName}
        className="w-full h-full hover:cursor-grab cursor-grabbing"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      />
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
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item: PieceItem) => onDrop(item, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // `isOver` is true when a piece hovers over this square.
    }),
  }));

  const isBlack = position && (position[0] + position[1]) % 2 === 1;

  const row = position && position[0];
  const col = position && position[1];
  const isFirstRow = row === 0;
  const isFirstColumn = col === 0;

  const fileNotation =
    isFirstRow && col !== null ? String.fromCharCode(97 + col) : "";
  const rankNotation = isFirstColumn && row !== null ? String(8 - row) : "";

  return (
    <div
      ref={drop}
      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ${
        isBlack ? "bg-[#b58863]" : "bg-[#f0d9b5]"
      } flex items-center justify-center relative`}
    >
      {isOver && (
        <div className="absolute top-0 left-0 h-full w-full bg-green-500 opacity-50" />
      )}
      {fileNotation && (
        <div
          className={`absolute top-0 left-1 text-xs font-bold ${
            isBlack ? "text-[#f0d9b5]" : "text-[#b58863]"
          }`}
        >
          {fileNotation}
        </div>
      )}
      {rankNotation && (
        <div
          className={`absolute bottom-0 right-1 text-xs font-bold ${
            isBlack ? "text-[#f0d9b5]" : "text-[#b58863]"
          }`}
        >
          {rankNotation}
        </div>
      )}
      {piece && <ChessPiece piece={piece} position={position} />}
    </div>
  );
};

const Chessboard = ({
  board,
  onDrop,
}: {
  board: Board;
  onDrop: (item: PieceItem, position: Position) => void;
}) => {
  return (
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
  );
};

const SidePanel = () => {
  const pieces: Piece[] = [
    "K",
    "Q",
    "R",
    "B",
    "N",
    "P",
    "k",
    "q",
    "r",
    "b",
    "n",
    "p",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:ml-4">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center"
        >
          <ChessPiece piece={piece} position={null} />
        </div>
      ))}
    </div>
  );
};

const DropZone = ({
  onDrop,
}: {
  onDrop: (item: PieceItem, position: Position) => void;
}) => {
  const [, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item: PieceItem) => onDrop(item, null),
  }));

  return (
    <div
      ref={drop}
      className="w-full h-16 bg-red-200 border-2 border-dashed border-red-500 rounded-lg mt-2 flex items-center justify-center text-red-700 font-semibold"
    >
      Drop piece here to remove
    </div>
  );
};

export default CreateChessPuzzlePost;
