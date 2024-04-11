import React from "react";
import styled from "styled-components";
import Square from "./Square";
import { useSelector } from "react-redux";

const StyledBoard = styled.div`
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
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
const Board = ({ game, getIncrement }) => {
  // Define the chess board as a 2D array
  // Render the chess board
  const board = game.getBoard();
  const isPlayer = useSelector((state) => state.user.isPlayer);
  const voteInfo = useSelector((state) => state.board.voteInfo);
  const orientation = game.side;
  const flipConstant = orientation === "w" ? 0 : 7;
  const getRow = (rowIndex) => Math.abs(flipConstant - rowIndex);
  const getCol = (colIndex) => Math.abs(flipConstant - colIndex);
  return (
    <StyledBoard
      id="game-board"
      game-side = {game.side}
      disabled={
        (isPlayer && voteInfo.isAllowed) || (!isPlayer && !voteInfo.isAllowed)
      }
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => (
            <div
              key={colIndex}
              className={`board-square ${
                (getRow(rowIndex) + getCol(colIndex)) % 2 === 0
                  ? "light-square"
                  : "dark-square"
              }`}
            >
              <Square
                piece={board[getRow(rowIndex)][getCol(colIndex)]}
                rowIndex={getRow(rowIndex)}
                colIndex={getCol(colIndex)}
                game={game}
                getIncrement={getIncrement}
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
