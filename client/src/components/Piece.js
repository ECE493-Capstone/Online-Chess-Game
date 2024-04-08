import React from "react";
import getPieceImage from "./Pieces";
import { useDispatch } from "react-redux";
import { setDragStart } from "../features/boardSlice";
import styled from "styled-components";

const StyledPiece = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  img {
    height: 40px;
  }
`;
const Piece = ({ piece, rowIndex, colIndex }) => {
  const dispatch = useDispatch();
  const handleDragStart = (e) => {
    dispatch(
      setDragStart({
        isDragStart: true,
        startIndex: [rowIndex, colIndex],
        piece,
      })
    );
  };
  const img = getPieceImage(piece);
  return (
    <StyledPiece>
      {piece && (
        <img src={img} alt="piece" draggable onDragStart={handleDragStart} />
      )}
    </StyledPiece>
  );
};

export default Piece;
