import React from "react";
import Board from "../Board";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Match = () => {
  const gameInfo = useSelector((state) => state.user.gameInfo);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const username = cookies.get("username");
  let oppUserId = "";
  let orientation = "white";
  if (gameInfo) {
    oppUserId =
      gameInfo.player1 === userId ? gameInfo.player2 : gameInfo.player1;
    orientation = gameInfo.player2 === userId ? "black" : "white";
  }
  console.log(orientation);
  return (
    <>
      <h1>{oppUserId}</h1>
      <Board orientation={orientation} />
      <h1>{userId}</h1>
    </>
  );
};

export default Match;
