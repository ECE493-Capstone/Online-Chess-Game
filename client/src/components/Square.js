import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickPiece, updateBoard } from "../features/boardSlice";
import Piece from "./Piece";
import styled from "styled-components";
const StyledSquare = styled.div`
  box-shadow: ${(props) =>
    props.ishighlighted ? " inset  0 0 40px #00abe3;" : null};
  transition: box-shadow 0.2s ease-in;
  width: 100%;
  height: 100%;
`;
const Square = ({ piece, rowIndex, colIndex }) => {
  const dispatch = useDispatch();
  const dragStart = useSelector((state) => state.board.dragStart);
  const clickHighlights = useSelector((state) => state.board.clickPiece);

  const isHighlighted = clickHighlights.legalMoves.some(
    (move) => move[0] === rowIndex && move[1] === colIndex
  );
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleClick = () => {
    const validMoves = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    dispatch(setClickPiece({ clickedSquare: piece, legalMoves: validMoves }));
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
      dispatch(
        updateBoard({
          from: [dragStart.startIndex[0], dragStart.startIndex[1]],
          to: [rowIndex, colIndex],
        })
      );
    }
  };

  return (
    <StyledSquare
      ishighlighted={isHighlighted}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Piece piece={piece} rowIndex={rowIndex} colIndex={colIndex} />
    </StyledSquare>
  );
};

export default Square;
