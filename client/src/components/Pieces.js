/*
  This file serves the following FRs:
  FR12 - Board.Create
*/



import BlackRook from "../assets/pieces/black-rook.png";
import BlackRookEvolved from "../assets/pieces/black-rook-evolved.png";
import BlackBishop from "../assets/pieces/black-bishop.png";
import BlackBishopEvolved from "../assets/pieces/black-bishop-evolved.png";
import BlackKnight from "../assets/pieces/black-knight.png";
import BlackKnightEvolved from "../assets/pieces/black-knight-evolved.png";
import BlackQueen from "../assets/pieces/black-queen.png";
import BlackKing from "../assets/pieces/black-king.png";
import BlackPawn from "../assets/pieces/black-pawn.png";
import BlackPawnEvolved from "../assets/pieces/black-pawn-evolved.png";

import WhiteRook from "../assets/pieces/white-rook.png";
import WhiteRookEvolved from "../assets/pieces/white-rook-evolved.png";
import WhiteBishop from "../assets/pieces/white-bishop.png";
import WhiteBishopEvolved from "../assets/pieces/white-bishop-evolved.png";
import WhiteKnight from "../assets/pieces/white-knight.png";
import WhiteKnightEvolved from "../assets/pieces/white-knight-evolved.png";
import WhiteQueen from "../assets/pieces/white-queen.png";
import WhiteKing from "../assets/pieces/white-king.png";
import WhitePawn from "../assets/pieces/white-pawn.png";
import WhitePawnEvolved from "../assets/pieces/white-pawn-evolved.png";
import Duck from "../assets/pieces/duck.png";

import { EVOLVE_SYMBOL, DUCK } from "../models/Chessboard";

function getPieceImage(piece) {
  if (piece === null) return null;

  // black
  if (piece.includes("R")) {
    return piece.includes(EVOLVE_SYMBOL) ? BlackRookEvolved : BlackRook;
  }
  if (piece.includes("N")) {
    return piece.includes(EVOLVE_SYMBOL) ? BlackKnightEvolved : BlackKnight;
  }
  if (piece.includes("B")) {
    return piece.includes(EVOLVE_SYMBOL) ? BlackBishopEvolved : BlackBishop;
  }
  if (piece === "Q") {
    return BlackQueen;
  }
  if (piece === "K") {
    return BlackKing;
  }
  if (piece.includes("P")) {
    return piece.includes(EVOLVE_SYMBOL) ? BlackPawnEvolved : BlackPawn;
  }

  // white
  if (piece.includes("r")) {
    return piece.includes(EVOLVE_SYMBOL) ? WhiteRookEvolved : WhiteRook;
  }
  if (piece.includes("n")) {
    return piece.includes(EVOLVE_SYMBOL) ? WhiteKnightEvolved : WhiteKnight;
  }
  if (piece.includes("b")) {
    return piece.includes(EVOLVE_SYMBOL) ? WhiteBishopEvolved : WhiteBishop;
  }
  if (piece === "q") {
    return WhiteQueen;
  }
  if (piece === "k") {
    return WhiteKing;
  }
  if (piece.includes("p")) {
    return piece.includes(EVOLVE_SYMBOL) ? WhitePawnEvolved : WhitePawn;
  }

  if (piece === DUCK) {
    return Duck;
  }
}

export default getPieceImage;
