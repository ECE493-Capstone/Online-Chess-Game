import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import styled from "styled-components";
import { Chess, WHITE, BLACK, SQUARES } from "chess.js";

const StyledBoardContainer = styled.div``;

const Board = ({ orientation }) => {
  const [game, setGame] = useState(new Chess());

  // states to handle piece click -------------------------------------------
  const [highlightedSquares, setHighlightedSquares] = useState({
    clickedSquare: null,
    legalMoveSquares: [],
  });
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [promotionToSquare, setPromotionToSquare] = useState(null);
  // -------------------------------------------------------------------------

  if (game.isGameOver()) {
    alert("Game Over");
  }

  const _clearHighlightedSquares = () => {
    setHighlightedSquares({
      clickedSquare: null,
      legalMoveSquares: [],
    });
  };

  const makeAMove = (move) => {
    console.log(move);
    const gameCopy = Object.assign(
      Object.create(Object.getPrototypeOf(game)),
      game
    );
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  };

  const onDrop = (sourceSquare, targetSquare, piece) => {
    const fromSquare = sourceSquare || highlightedSquares.clickedSquare; // = clickedSquare if it's a promotion in click mode
    const legalTargetSquares = game
      .moves({ square: fromSquare, verbose: true })
      .map((move) => move.to);

    let move = null;
    if (legalTargetSquares.includes(targetSquare)) {
      move = makeAMove({
        from: fromSquare,
        to: targetSquare,
        promotion: piece.slice(-1).toLowerCase(), // piece is a string like 'wP' or 'bQ'
      });
      console.log(game.board());
    }

    _clearHighlightedSquares();

    return move === null ? false : true;
  };

  const onOwnPieceClicked = (square) => {
    if (highlightedSquares.clickedSquare === square) {
      _clearHighlightedSquares();
    } else {
      const legalNextMoves = game
        .moves({ square: square, verbose: true })
        .map((move) => ({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
          captured: move.captured,
        }));
      setHighlightedSquares({
        clickedSquare: square,
        legalMoveSquares: legalNextMoves,
      });
    }
  };

  const onPieceDragBegan = (piece, square) => onOwnPieceClicked(square);

  const onSquareClicked = (square) => {
    if (game.isGameOver()) return;

    const piece = game.get(square);

    // click on an empty square or on the opponent's piece
    if (!piece || piece.color !== game.turn()) {
      const moves = highlightedSquares.legalMoveSquares.filter(
        (move) => move.to === square
      );
      if (moves.length === 1) {
        makeAMove({
          from: highlightedSquares.clickedSquare,
          to: square,
        });
      } else if (moves.some((move) => move.promotion)) {
        setShowPromotionDialog(true);
        setPromotionToSquare(square);
        return;
      }

      _clearHighlightedSquares();
      return;
    }

    // click on the player's own piece
    onOwnPieceClicked(square);
  };
  return (
    <StyledBoardContainer>
      <Chessboard
        className="board"
        boardWidth={window.innerHeight * 0.8}
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        onSquareClick={onSquareClicked}
        customSquareStyles={{
          [highlightedSquares.clickedSquare]: {
            backgroundColor: "#9dc3e6",
          },
          ...highlightedSquares.legalMoveSquares.reduce((acc, legalMove) => {
            acc[legalMove.to] = legalMove.captured
              ? { backgroundColor: "#ff3333" }
              : {
                  background:
                    "radial-gradient(circle, grey 20%, transparent 10%)",
                };
            return acc;
          }, {}),
        }}
        showPromotionDialog={showPromotionDialog} // only applicable to piece click mode
        promotionToSquare={promotionToSquare} // only applicable to piece click mode
        onPieceDragBegin={onPieceDragBegan}
        isDraggablePiece={({ piece, sourceSquare }) =>
          piece[0] === game.turn() && !game.isGameOver()
        }
      />
    </StyledBoardContainer>
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
