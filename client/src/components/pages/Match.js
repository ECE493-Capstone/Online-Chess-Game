import React, { useEffect, useState } from "react";
import Board from "../Board";
import { BLACK, Chessboard, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../features/boardSlice";
import { getOngoingGameInformationByGameId } from "../../api/ongoingGames";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { socket } from "../../app/socket";
import toast from "react-hot-toast";
import NoticeDialog from "../dialog/NoticeDialog";
import { setIsPlayer } from "../../features/userSlice";

const Match = () => {
  const game = useSelector((state) => state.board.game);
  const [input, setInput] = React.useState(null);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const { gameId } = useParams();
  console.log(game);
  useEffect(() => {
    if (game) {
      if (input !== null) {
        const gameCopy = game.copy();
        gameCopy.playOpponentMove(input);
        dispatch(setGame(gameCopy));
        setInput(null);
      }
      return;
    }
    if (userId) {
      socket.on("oppMove", (input) => {
        console.log("input", input);
        setInput(input);
      });
      socket.on("opponent disconnected", (input) => {
        console.log("WTF");
        setIsOpponentDisconnected(true);
        toast.error("Opponent Disconnected!");
      });
      socket.on("opponent reconnected", (input) => {
        setIsOpponentDisconnected(false);
        toast.success("Opponent Reconnected!");
      });
      socket.on("opponent abandoned", (input) => {
        setIsOpponentDisconnected(false);
        toast.error("Opponent Abandoned the game!");
      });
    }
    let orientation = WHITE;
    const fetchGame = async () => {
      if (gameId) {
        await getOngoingGameInformationByGameId(gameId).then((data) => {
          const isPlayer =
            userId && (data.player1 === userId || data.player2 === userId);
          orientation = !userId || data.player1 === userId ? WHITE : BLACK;
          const chessboard = new Chessboard(
            orientation,
            data.mode,
            data.fen[data.fen.length - 1]
          );
          dispatch(setIsPlayer(isPlayer));
          dispatch(setGame(chessboard));
        });
      }
    };
    fetchGame();
  }, [input]);
  return (
    <>
      {game && <Board game={game} />}
      {isOpponentDisconnected && <NoticeDialog />}
    </>
  );
};

export default Match;
