import React, { useEffect } from "react";
import Board from "../Board";
import { Chessboard, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../features/boardSlice";

const Match = () => {
  const game = useSelector((state) => state.board.game);
  const dispatch = useDispatch();
  console.log(game);
  useEffect(() => {
    if (game) {
      return;
    }
    const chessboard = new Chessboard(WHITE);
    dispatch(setGame(chessboard));
  }, []);
  return <>{game && <Board game={game} />}</>;
};

export default Match;
