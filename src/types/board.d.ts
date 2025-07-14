export type Piece =
  | "K"
  | "Q"
  | "R"
  | "B"
  | "N"
  | "P"
  | "k"
  | "q"
  | "r"
  | "b"
  | "n"
  | "p"
  | "";
export type Board = Piece[][];
export type Position = [number, number] | null;

export interface PieceItem {
  piece: Piece;
  position: Position;
}

export type SquareStyles = {
  [key in Square]?: {
    background?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
};

export type MoveInput =
  | string
  | { from: string; to: string; promotion?: string };
