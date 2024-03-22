import React, { useState } from "react";
import styled from "styled-components";
import Pieces from "./Pieces";
import { useSelector } from "react-redux";
import Square from "./Square";
import { Chessboard, WHITE } from "../models/Chessboard";

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  width: 400px;
  height: 400px;
  .board-row {
    display: flex;
    .board-square {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .light-square {
      background-color: #f0d9b5;
    }

    .dark-square {
      background-color: #b58863;
    }
  }
`;
const Board = ({ game }) => {
  // Define the chess board as a 2D array
  // Render the chess board
  const board = game.getBoard();
  return (
    <StyledBoard>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => (
            <div
              key={colIndex}
              className={`board-square ${
                (rowIndex + colIndex) % 2 === 0 ? "light-square" : "dark-square"
              }`}
            >
              <Square
                piece={piece}
                rowIndex={rowIndex}
                colIndex={colIndex}
                game={game}
              />
            </div>
          ))}
        </div>
      ))}
    </StyledBoard>
  );
};

export default Board;

/* important library methods maybe?
  .ascii()
  .board()
  .clear()
  .fen()
  .get(square)
  .getCastlingRights(color)
  .history([options])
  .inCheck()
  .isAttacked(square,color)
  .isCheckmate()
  .isDraw()
  .isGameOver()
  .isStalemate()
  .inThreefoldRepetition()
  .load(fen)
  .move(move, [options])
  .put(piece, square)
  .remove(square)
  .reset()
  .setCastlingRights(color, rights)
  .turn()
  .undo()
  .validateFen(fen)
*/
