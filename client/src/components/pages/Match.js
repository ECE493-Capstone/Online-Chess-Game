import React, { useEffect, useState, useReducer } from "react";
import Board from "../Board";
import { BLACK, Chessboard, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../features/boardSlice";
import { getOngoingGameInformation } from "../../api/ongoingGames";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../app/socket";
import styled from "styled-components";
import NoticeDialog from "../dialog/NoticeDialog";
import Timer from "../game-room/Timer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import MoveHistory from "../game-room/MoveHistory";
import RequestButtons from "../game-room/RequestButtons";
import { fetchUser } from "../../api/fetchUser";
import H2H from "../game-room/H2H";
import Header from "../Header";

const Container = styled.div`
  /* border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: fit-content;
  padding: 10px 10px; */
  display: flex;
  .lhs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 60vw;

    .board {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: fit-content;

      .spectator {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        h3 {
          margin-left: 5px;
          font-size: 1.3rem;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0px;

        h2 {
          color: orange;
        }
      }

      .share-btn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .rhs {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 40vw;
    height: 100vh;

    .move-history {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 70%;
    }

    .request-btns {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
    }
  }
`;

const MatchReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        player: action.payload.player,
        opponent: action.payload.opponent,
        playerTime: action.payload.playerTime,
        opponentTime: action.payload.opponentTime,
        increment: action.payload.increment,
      };
    case "PLAYER_TIME":
      return { ...state, playerTime: action.payload };
    case "OPPONENT_TIME":
      return { ...state, opponentTime: action.payload };
    case "BTN_DISABLED":
      return { ...state, btnDisabled: action.payload };
    default:
      return state;
  }
};

const Match = () => {
  // data area
  const game = useSelector((state) => state.board.game);
  const { gameId } = useParams();
  const [input, setInput] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const dispatch = useDispatch();

  const [matchState, matchDispatch] = useReducer(MatchReducer, {
    player: null,
    opponent: null,
    playerTime: null,
    opponentTime: null,
    increment: null,
    btnDisabled: false,
  });
  const cookies = new Cookies();
  const userId = cookies.get("userId");
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
      const gameInfoData = await getOngoingGameInformation(userId);
      orientation = gameInfoData.player1 === userId ? WHITE : BLACK;
      const chessboard = new Chessboard(orientation);
      console.log(orientation);
      dispatch(setGame(chessboard));

      const opponentId =
        gameInfoData.player1 === userId
          ? gameInfoData.player2
          : gameInfoData.player1;
      const opponentInfo = (await fetchUser(opponentId)).data;
      console.log(opponentInfo);
      const playerInfo = (await fetchUser(userId)).data;
      const tc = gameInfoData.timeControl.split(" ");
      const initTimeInMs = parseInt(tc[0]) * 1000 * 60;
      const incrementInMs = parseInt(tc[2]) * 1000;
      matchDispatch({
        type: "INIT",
        payload: {
          player: {
            ...playerInfo,
            id: userId,
          },
          opponent: {
            ...opponentInfo,
            id: opponentId,
          },
          playerTime: initTimeInMs,
          opponentTime: initTimeInMs,
          increment: incrementInMs,
        },
      });
    };
    fetchGame();
  }, [input]);

  const copyUrlToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(
        // display toast
        () => {
          console.log("URL copied to clipboard");
          setShowShareToast(true);
        }
      )
      .catch((error) => {
        console.log("Failed to copy URL to clipboard", error);
      });
  };

  const onUndoBtnClicked = () => {
    console.log("Undo clicked");
  };

  const onDrawBtnClicked = () => {
    console.log("Draw clicked");
  };

  const onResignBtnClicked = () => {
    console.log("Resign clicked");
    // matchDispatch({ type: "BTN_DISABLED", payload: true });
    // socket.emit("resign", {
    //   gameRoom: gameId,
    //   fromPlayerId: matchState.player.id,
    //   toPlayerId: matchState.opponent.id,
    // });
  };

  const onPlayerTimeout = () => {
    console.log("Player Timeout");
  };

  const onOpponentTimeout = () => {
    console.log("Opponent Timeout");
  };

  return (
    <Container>
      {showShareToast && (
        <Snackbar
          open={showShareToast}
          autoHideDuration={1500}
          onClose={() => setShowShareToast(false)}
          message="URL copied to clipboard"
        />
      )}
      <div className="lhs">
        {game ? (
          <div className="board">
            {/* {numSpectators > 0 && (
              <div className="spectator">
                <VisibilityIcon />
                <h3>{numSpectators}</h3>
              </div>
            )} */}
            <div className="info">
              <h2>{matchState.opponent?.username}</h2>
              {matchState.opponentTime !== null && (
                <Timer
                  initTimeInMs={matchState.opponentTime}
                  isActive={!game.isSameTurn(game.side)}
                  onTimeoutCb={onOpponentTimeout}
                />
              )}
            </div>
            <Board game={game} />
            <div className="info">
              <h2>{matchState.player?.username}</h2>
              {matchState.playerTime !== null && (
                <Timer
                  initTimeInMs={matchState.playerTime}
                  isActive={game.isSameTurn(game.side)}
                  onTimeoutCb={onPlayerTimeout}
                />
              )}
            </div>
            <div className="share-btn">
              <Button
                onClick={copyUrlToClipboard}
                variant="contained"
                color="info"
              >
                {<ShareIcon />}
              </Button>
            </div>
          </div>
        ) : (
          <NoticeDialog content="Waiting for opponent..." />
        )}
      </div>

      {game && (
        <div className="rhs">
          <div>
            <H2H
              player1Id={matchState.player?.id}
              player2Id={matchState.opponent?.id}
            />
          </div>
          <div className="move-history">
            <MoveHistory />
          </div>
          <div className="request-btns">
            <RequestButtons
              onUndoClicked={onUndoBtnClicked}
              onDrawClicked={onDrawBtnClicked}
              onResignClicked={onResignBtnClicked}
              isDisabled={matchState.btnDisabled}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Match;
