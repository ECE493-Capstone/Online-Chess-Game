import React, { useState, useEffect } from 'react';
import { getOngoingGameInformation } from '../api/ongoingGames';
import { fetchUser } from "../api/fetchUser";
import { AppBar, Toolbar, Typography, Divider } from '@mui/material';
import styled from "styled-components";
import { getPastGamesInformationWithOpponent } from '../api/pastGames';
const Head2Head = ({ PlayerId }) => {

    const [opponentId, setOpponentId] = useState("");
    const [playerUsername, setPlayerUsername] = useState("");
    const [opponentUsername, setOpponentUsername] = useState("");
    const [color, setColor] = useState("");
    const[playerGameData, setPlayerGameData] = useState("");
    const[opponentGameData, setOpponentGameData] = useState("");
    const[playerTotalWins, setPlayerTotalWins] = useState("");
    const[opponentTotalWins, setOpponentTotalWins] = useState("");

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
    }, []);

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
                console.log("H2H DETECTS USER: userID: " + JSON.stringify(storedUserId) + " username: " + JSON.stringify(username));
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
    }, []);

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
                console.log("H2H DETECTS OPPONENT: opponentID: " + JSON.stringify(opponentId) + " opponentusername: " + JSON.stringify(username));
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

  const samplePlayerGameData = {
    Classic: [
      { win: 1, lose: 5, tie: 3 }
    ],
    Blind: [
      { win: 7, lose: 84, tie: 2 }
    ],
    PowerUp: [
      { win: 15, lose: 3, tie: 1 }
    ]
  };

  const sampleOpponentGameData = {
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

  const formatPastGamesResults = async (userId, opponentId, setPlayerGameData, setOpponentGameData, setPlayerTotalWins, setOpponentTotalWins) => {

    try {
      // Retrieve past games information
      const gamesData = await getPastGamesInformationWithOpponent(userId, opponentId);
    
      // Process games data to separate player and opponent games
      const playerData = {
        Classic: [{ win: 0, lose: 0, tie: 0 }],
        Blind: [{ win: 0, lose: 0, tie: 0 }],
        PowerUp: [{ win: 0, lose: 0, tie: 0 }]
      };
    
      const opponentData = {
        Classic: [{ win: 0, lose: 0, tie: 0 }],
        Blind: [{ win: 0, lose: 0, tie: 0 }],
        PowerUp: [{ win: 0, lose: 0, tie: 0 }]
      };
    
      let playerTotalWins = 0;
      let opponentTotalWins = 0;
    
      // Loop through each game
      gamesData.forEach((game) => {
        if (game.mode === "Classic") {
          if (game.winner === userId) {
            playerTotalWins++;
            playerData.Classic[0].win++;
            opponentData.Classic[0].lose++;
          } else if (game.winner === opponentId) {
            opponentTotalWins++;
            playerData.Classic[0].lose++;
            opponentData.Classic[0].win++;
          } else if (game.tie && game.winner === null) {
            playerData.Classic[0].tie++;
            opponentData.Classic[0].tie++;
          }
        } else if (game.mode === "Blind") {
          if (game.winner === userId) {
            playerTotalWins++;
            playerData.Blind[0].win++;
            opponentData.Blind[0].lose++;
          } else if (game.winner === opponentId) {
            opponentTotalWins++;
            playerData.Blind[0].lose++;
            opponentData.Blind[0].win++;
          } else if (game.tie && game.winner === null) {
            playerData.Blind[0].tie++;
            opponentData.Blind[0].tie++;
          }
        } else if (game.mode === "PowerUp") {
          if (game.winner === userId) {
            playerTotalWins++;
            playerData.PowerUp[0].win++;
            opponentData.PowerUp[0].lose++;
          } else if (game.winner === opponentId) {
            opponentTotalWins++;
            playerData.PowerUp[0].lose++;
            opponentData.PowerUp[0].win++;
          } else if (game.tie && game.winner === null) {
            playerData.PowerUp[0].tie++;
            opponentData.PowerUp[0].tie++;
          }
        }
      });
    
      setPlayerGameData(playerData);
      setOpponentGameData(opponentData);
      setPlayerTotalWins(playerTotalWins);
      setOpponentTotalWins(opponentTotalWins);
  
    } catch (error) {
      // Handle errors if fetching past games information fails
      console.error("Error fetching past games:", error);
      // You can handle errors appropriately here
    }
  }

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
    colors.push(getColor(playerGameData.Classic[0].win, opponentGameData.Classic[0].win));
    colors.push(getColor(opponentGameData.Classic[0].win, playerGameData.Classic[0].win));
  
    // Blind
    colors.push(getColor(playerGameData.Blind[0].win, opponentGameData.Blind[0].win));
    colors.push(getColor(opponentGameData.Blind[0].win, playerGameData.Blind[0].win));
  
    // PowerUp
    colors.push(getColor(playerGameData.PowerUp[0].win, opponentGameData.PowerUp[0].win));
    colors.push(getColor(opponentGameData.PowerUp[0].win, playerGameData.PowerUp[0].win));
  
    // Total wins
    colors.push(getColor(playerTotalWins, opponentTotalWins));
    colors.push(getColor(opponentTotalWins, playerTotalWins));
  
    return colors;
  };

useEffect(() => {
  if (PlayerId !== "" && opponentId !== "") {
    formatPastGamesResults(PlayerId, opponentId, setPlayerGameData, setOpponentGameData, setPlayerTotalWins, setOpponentTotalWins);
  }
}, [opponentId]);

useEffect(() => {
  if (playerGameData !== "" && opponentGameData !== "") {
    setColor(getColorArray());
  }
}, [playerGameData, opponentGameData]);

const longUsernameTest = "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
  
  return (
    <div>
      {playerGameData && opponentGameData && color && (
        <>
          <AppBar position="static">
            <Toolbar style={{ justifyContent: 'flex-end'}}>
              <Typography variant="h6" style={{ 
                borderRight: '0.1em solid white', 
                padding: '0.5em',   
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "75%",
              }}>
                <strong>{playerUsername}</strong>&nbsp;
              </Typography>
              <Typography variant="h6">&nbsp;Wins:&nbsp;</Typography>
              <Typography variant="h6" style={{ color: color[0] }}>
                Classic: {playerGameData.Classic[0].win}&nbsp;
              </Typography>
              <Typography variant="h6" style={{ color: color[2] }}>
                &nbsp;Blind: {playerGameData.Blind[0].win}&nbsp;
              </Typography>
              <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em', color: color[4] }}>
                PowerUp: {playerGameData.PowerUp[0].win}
              </Typography>
              <Typography variant="h6" style={{ color: color[6] }}>
                &nbsp;{playerTotalWins}
              </Typography>
            </Toolbar>
          </AppBar>
          <AppBar position="static">
            <Toolbar style={{ justifyContent: 'flex-end' }}>
              <Typography variant="h6" style={{ 
                borderRight: '0.1em solid white', 
                padding: '0.5em',   
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "75%",
              }}>
                <strong>{opponentUsername}</strong>&nbsp;
              </Typography>
              <Typography variant="h6">&nbsp;Wins:&nbsp;</Typography>
              <Typography variant="h6" style={{ color: color[1] }}>
                Classic: {opponentGameData.Classic[0].win}&nbsp;
              </Typography>
              <Typography variant="h6" style={{ color: color[3] }}>
                &nbsp;Blind: {opponentGameData.Blind[0].win}&nbsp;
              </Typography>
              <Typography variant="h6" style={{ borderRight: '0.1em solid white', padding: '0.5em', color: color[5] }}>
                PowerUp: {opponentGameData.PowerUp[0].win}
              </Typography>
              <Typography variant="h6" style={{ color: color[7] }}>
                &nbsp;{opponentTotalWins}
              </Typography>
            </Toolbar>
          </AppBar>
        </>
      )}
    </div>
  );
};

export default Head2Head;
