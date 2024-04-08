import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { fetchUser } from "../../api/fetchUser.js";
import { getH2HRecord } from "../../api/util.js";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid orange;
  background-color: black;
  border-radius: 10px;
  margin: 10px;
  width: fit-content;
  min-width: 320px;

  .divider {
    margin: 0;
    border-color: orange;
  }

  .player-info {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;

      hr {
        margin: 0 10px;
        border: 1px solid;
        height: 100%;
      }
    }
  }
  .player-info.winner {
    color: green;

    hr {
      border-color: green;
    }
  }

  .player-info.loser {
    opacity: 0.2;

    color: red;

    hr {
      border-color: red;
    }
  }
`;

const H2HReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        player1: action.payload.player1,
        player2: action.payload.player2,
      };
    default:
      return state;
  }
};

const H2H = ({
  player1Id = "6601e21450d748bdbd642836",
  player2Id = "6605725ea2486950a5d3bc9b",
}) => {
  const [state, dispatch] = useReducer(H2HReducer, {
    player1: null,
    player2: null,
  });

  useEffect(() => {
    // fetch player1 and player2 information
    const fetchH2HRecord = async () => {
      const player1Data = (await fetchUser(player1Id)).data;
      const player2Data = (await fetchUser(player2Id)).data;
      const h2hRecord = await getH2HRecord(player1Id, player2Id);

      dispatch({
        type: "INIT",
        payload: {
          player1: {
            name: player1Data.username,
            wins: h2hRecord[player1Id],
          },
          player2: {
            name: player2Data.username,
            wins: h2hRecord[player2Id],
          },
        },
      });
    };
    if (player1Id && player2Id) fetchH2HRecord();
  }, [player1Id, player2Id]);

  return (
    <>
      {state.player1 && state.player2 && (
        <Container>
          <div
            className={`player-info ${
              state.player1.wins > state.player2.wins
                ? "winner"
                : state.player1.wins < state.player2.wins
                ? "loser"
                : ""
            }`}
          >
            <div>
              <h3>{state.player1.wins}</h3>
              <hr />
            </div>
            <h3 className="name">{state.player1.name}</h3>
          </div>
          <hr className="divider" />
          <div
            className={`player-info ${
              state.player1.wins < state.player2.wins
                ? "winner"
                : state.player1.wins > state.player2.wins
                ? "loser"
                : ""
            }`}
          >
            <h3 className="name">{state.player2.name}</h3>
            <div>
              <hr />
              <h3>{state.player2.wins}</h3>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
export default H2H;
