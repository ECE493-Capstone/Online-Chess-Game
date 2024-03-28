import React, { useState, useEffect } from 'react';
import { getOngoingGameInformation } from '../api/ongoingGames';
import { fetchUser } from "../api/fetchUser";
import { AppBar, Toolbar, Typography, Divider } from '@mui/material';
import styled from "styled-components";

const Head2Head = ({ PlayerId }) => {

    const [opponentId, setOpponentId] = useState("");
    const [playerUsername, setPlayerUsername] = useState("");
    const [opponentUsername, setOpponentUsername] = useState("");

    useEffect(() => {
        const getOtherPlayer = async () => {
            try {
            const gameData = await getOngoingGameInformation(PlayerId);
        
            console.log('This is the data fetched:', gameData);
        
            const otherPlayerId = gameData.player1 === PlayerId ? gameData.player2 : gameData.player1;
            setOpponentId(otherPlayerId);
            console.log('ID of the other player:', otherPlayerId);
            } catch (error) {
            console.error('Error fetching game data:', error);
            }
        };
        
        getOtherPlayer();
    }, [PlayerId]);

    useEffect(() => {
        const getPlayerName = async (PlayerId) => {
            try {
            const storedUserId = PlayerId;
        
            if (storedUserId) {
                console.log('Retrieved user ID from cookie: ' + storedUserId);
        
                const response = await fetchUser(storedUserId);
                const userData = response.data;
        
                if (response.status === 200) {
                const { username } = userData;
                setPlayerUsername(username);
                console.log("HEADER DETECTS USER: userID: " + JSON.stringify(storedUserId) + " username: " + JSON.stringify(username));
                } else {
                console.log("Failed to fetch user data");
                }
            } else {
                console.log("H2H doesn't detect user.");
                setPlayerUsername("");
                // navigate('/');
            }
            } catch (error) {
            console.log(error);
            }
            };

        getPlayerName(PlayerId);
    }, [PlayerId]);

    useEffect(() => {
        const getOpponentName = async (opponentId) => {
            try {
            //   const storedUserId = cookie.get("userId");
            // const opponentId = opponentId;
        
            if (opponentId) {
                console.log('This is the opponent ID: ' + opponentId);
        
                const response = await fetchUser(opponentId);
                const userData = response.data;
        
                if (response.status === 200) {
                const { username } = userData;
                setOpponentUsername(username);
                console.log("HEADER DETECTS OPPONENT: opponentID: " + JSON.stringify(opponentId) + " opponentusername: " + JSON.stringify(username));
                } else {
                console.log("Failed to fetch opponent data");
                }
            } else {
                console.log("H2H doesn't detect opponent.");
                setOpponentUsername("");
                // navigate('/');
            }
            } catch (error) {
            console.log(error);
            }
            };

        getOpponentName(opponentId);
    }, [opponentId]);

      

  // TODO: When they finish with the schema for getting the game results between the players, I will implement it. For now, it is hard-coded.

  const PlayerGameData = {
    Classic: [
      { win: 1, lose: 5, tie: 3 }
    ],
    Blind: [
      { win: 7, lose: 8, tie: 2 }
    ],
    PowerUp: [
      { win: 15, lose: 3, tie: 1 }
    ]
  };

  const OpponentGameData = {
    Classic: [
      { win: 1, lose: 5, tie: 3 }
    ],
    Blind: [
      { win: 3, lose: 8, tie: 2 }
    ],
    PowerUp: [
      { win: 23, lose: 3, tie: 1 }
    ]
  };

  const playerTotalWins = Object.values(PlayerGameData).reduce((acc, gameModeData) => {
    return acc + gameModeData[0].win;
  }, 0);

  const opponentTotalWins = Object.values(OpponentGameData).reduce((acc, gameModeData) => {
    return acc + gameModeData[0].win;
  }, 0);
  
  const getColorArray = () => {

    const getColor = (playerValue, opponentValue) => {
        if (playerValue > opponentValue) {
            return 'green';
        } else if (playerValue < opponentValue) {
            return 'red';
        } else {
            return 'grey';
        }
    };
      
    const colors = [];
  
    // Classic
    colors.push(getColor(PlayerGameData.Classic[0].win, OpponentGameData.Classic[0].win));
    colors.push(getColor(OpponentGameData.Classic[0].win, PlayerGameData.Classic[0].win));
  
    // Blind
    colors.push(getColor(PlayerGameData.Blind[0].win, OpponentGameData.Blind[0].win));
    colors.push(getColor(OpponentGameData.Blind[0].win, PlayerGameData.Blind[0].win));
  
    // PowerUp
    colors.push(getColor(PlayerGameData.PowerUp[0].win, OpponentGameData.PowerUp[0].win));
    colors.push(getColor(OpponentGameData.PowerUp[0].win, PlayerGameData.PowerUp[0].win));
  
    // Total wins
    colors.push(getColor(playerTotalWins, opponentTotalWins));
    colors.push(getColor(opponentTotalWins, playerTotalWins));
  
    return colors;
  };
  
  const colors = getColorArray();
  
  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'flex-end' }}>
          <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em' }} >
            <strong>{playerUsername}</strong>&nbsp;
          </Typography>
          <Typography variant="h6">&nbsp;Wins:&nbsp;</Typography>
          <Typography variant="h6" style={{ color: colors[0] }}>
            Classic: {PlayerGameData.Classic[0].win}&nbsp;
          </Typography>
          <Typography variant="h6" style={{ color: colors[2] }}>
            &nbsp;Blind: {PlayerGameData.Blind[0].win}&nbsp;
          </Typography>
          <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em', color: colors[4] }}>
            PowerUp: {PlayerGameData.PowerUp[0].win}
          </Typography>
          <Typography variant="h6" style={{ color: colors[6] }}>
            &nbsp;{playerTotalWins}
          </Typography>
        </Toolbar>
      </AppBar>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'flex-end' }}>
          <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em' }} >
            <strong>{opponentUsername}</strong>&nbsp;
          </Typography>
          <Typography variant="h6">&nbsp;Wins:&nbsp;</Typography>
          <Typography variant="h6" style={{ color: colors[1] }}>
            Classic: {OpponentGameData.Classic[0].win}&nbsp;
          </Typography>
          <Typography variant="h6" style={{ color: colors[3] }}>
            &nbsp;Blind: {OpponentGameData.Blind[0].win}&nbsp;
          </Typography>
          <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em', color: colors[5] }}>
            PowerUp: {OpponentGameData.PowerUp[0].win}
          </Typography>
          <Typography variant="h6" style={{ color: colors[7] }}>
            &nbsp;{opponentTotalWins}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
  
};

export default Head2Head;