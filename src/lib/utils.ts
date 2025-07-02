import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import { Piece } from "@/types/board";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export const convertBoardToFEN = (board: Piece[][]): string => {
  return board
    .map((row) => {
      let emptyCount = 0;
      return (
        row
          .map((square) => {
            if (square === "") {
              emptyCount++;
              return "";
            } else {
              const result = emptyCount > 0 ? emptyCount + square : square;
              emptyCount = 0;
              return result;
            }
          })
          .join("") + (emptyCount > 0 ? emptyCount : "")
      );
    })
    .join("/");
};

export const convertFENToBoard = (fen: string): Piece[][] => {
  if (!fen || typeof fen !== "string") {
    return Array(8).fill(Array(8).fill(""));
  }
  const board: Piece[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(""));
  const rows = fen.split("/");

  rows.forEach((row, rowIndex) => {
    let colIndex = 0;
    row.split("").forEach((char) => {
      if (char >= "1" && char <= "8") {
        colIndex += parseInt(char);
      } else {
        board[rowIndex][colIndex] = char as Piece;
        colIndex++;
      }
    });
  });

  return board;
};

/** Extracts the very first name from url Ex chess from https://www.chess.com or docs from https://docs.chess.com */
export const extractMainDomain = (url: string) => {
  const domain = url.split("//")[1]?.split(".com")[0];
  if (!domain) return "";
  const parts = domain.split(".");
  return parts[0] === "www" ? parts[1] : parts[0];
};

/**For improper FEN without six space-delimited fields  add some default values to make it valid for chess.js*/
export const normaliseFEN = (fen: string): string => {
  const parts = fen.trim().split(" ");
  if (parts.length == 6) return fen;
  if (parts.length == 1) return `${fen} w - - 0 1`;
  const [
    position,
    turn = "w",
    castling = "-",
    enPassant = "-",
    halfmove = "0",
    fullmove = "1",
  ] = parts;
  return `${position} ${turn} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
};

export const wait = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};
