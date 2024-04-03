import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickPiece, setGame } from "../features/boardSlice";
import Piece from "./Piece";
import styled from "styled-components";
import { socket } from "../app/socket";
import { useParams } from "react-router-dom";

const StyledSquare = styled.div`
  box-shadow: ${(props) =>
    props.ishighlighted === "true" ? " inset  0 0 40px #00abe3;" : null};
  transition: box-shadow 0.2s ease-in;
  width: 100%;
  height: 100%;
`;
const Square = ({ piece, rowIndex, colIndex, game }) => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const dragStart = useSelector((state) => state.board.dragStart);
  const clickHighlights = useSelector((state) => state.board.clickPiece);
  const isHighlighted = clickHighlights.legalMoves.some(
    (move) => move[0] === rowIndex && move[1] === colIndex
  );
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleMovePiece = (move) => {
    const gameCopy = game.copy();
    gameCopy.playYourMove(move);
    dispatch(setGame(gameCopy));
    socket.emit("move piece", {
      gameRoom: gameId,
      input: move,
      fen: gameCopy.convertToFEN(),
    });
  };
  const handleClick = () => {
    if (game.isSameTurn(game.side)) {
      // move the piece
      if (isHighlighted) {
        const move = {
          fromRow: clickHighlights.clickedSquare.rowIndex,
          fromCol: clickHighlights.clickedSquare.colIndex,
          toRow: rowIndex,
          toCol: colIndex,
        };
        if (game.isLegalMove(move)) {
          handleMovePiece(move);
          dispatch(
            setClickPiece({
              clickedSquare: null,
              legalMoves: [],
            })
          );
        }
      } else {
        // highlight if clicked on piece
        if (piece && game._isSameSide(piece)) {
          dispatch(
            setClickPiece({
              clickedSquare: { rowIndex, colIndex },
              legalMoves: game._getLegalMoves(rowIndex, colIndex),
            })
          );
        } else if (clickHighlights.clickedSquare) {
          dispatch(
            setClickPiece({
              clickedSquare: null,
              legalMoves: [],
            })
          );
        }
      }
    }
  };
  const handleDrop = (e) => {
    if (
      dragStart.isDragStart &&
      !(
        dragStart.startIndex[0] === rowIndex &&
        dragStart.startIndex[1] === colIndex
      )
    ) {
      e.preventDefault();
      const move = {
        fromRow: dragStart.startIndex[0],
        fromCol: dragStart.startIndex[1],
        toRow: rowIndex,
        toCol: colIndex,
      };
      if (game.isLegalMove(move)) {
        handleMovePiece(move);
      }
    }
  };

  return (
    <StyledSquare
      ishighlighted={isHighlighted.toString()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Piece piece={piece} rowIndex={rowIndex} colIndex={colIndex} />
    </StyledSquare>
  );
};

export default Square;
