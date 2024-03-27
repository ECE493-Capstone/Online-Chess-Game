import React, { useEffect } from "react";
import Board from "../Board";
import { BLACK, Chessboard, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../features/boardSlice";
import { getOngoingGameInformation } from "../../api/ongoingGames";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { socket } from "../../app/socket";

const Match = () => {
  const game = useSelector((state) => state.board.game);
  const [input, setInput] = React.useState(null);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    socket.on("oppMove", (input) => {
      console.log("input", input);
      setInput(input);
    });
    if (!userId) {
      navigate("/test");
    }
    let orientation = WHITE;
    const fetchGame = async () => {
      await getOngoingGameInformation(userId).then((data) => {
        orientation = data.player1 === userId ? WHITE : BLACK;
        const chessboard = new Chessboard(orientation);
        dispatch(setGame(chessboard));
      });
    };
    fetchGame();
  }, [input]);
  return <>{game && <Board game={game} />}</>;
};

export default Match;
