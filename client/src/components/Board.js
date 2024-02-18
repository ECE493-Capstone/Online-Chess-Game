import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import styled from "styled-components";
import { Chess } from "chess.js";

const StyledBoardContainer = styled.div``;
const Board = () => {
  const [game, setGame] = useState(new Chess());
  const makeAMove = (move) => {
    const gameCopy = Object.assign(
      Object.create(Object.getPrototypeOf(game)),
      game
    );
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    console.log(game.board());
    if (move === null) return false;
    return true;
  };
  return (
    <StyledBoardContainer>
      <Chessboard
        className="board"
        boardWidth={window.innerHeight * 0.8}
        position={game.fen()}
        onPieceDrop={onDrop}
      />
    </StyledBoardContainer>
  );
};

export default Board;
