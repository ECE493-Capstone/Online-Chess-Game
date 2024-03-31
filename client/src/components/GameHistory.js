import React, { useEffect, useState } from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import { getPastGamesInformation } from '../api/pastGames'; // Import your function to fetch past games
import { fetchUser } from "../api/fetchUser";

const Title = styled.div`
  font-size: 20px;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const GameHistory = ({ userId, username, setIsLoggedIn }) => {

  const [games, setGames] = useState([]);
  const [updatedGames, setUpdatedGames] = useState([]);

  const getOpponentName = async (opponentId) => {
    try {
      const response = await fetchUser(opponentId);
      const userData = response.data;
  
      if (response.status === 200) {
        const { username } = userData;
        return username;
      } else {
        console.log("Failed to fetch opponent data");
      }
    } catch (error) {
      console.log(error);
    }
  }; 
  
  const updateGameEntries = async (games) => {
    const updatedGames = await Promise.all(
      games.map(async (game, index) => {
        const updatedEntry = { ...game };
  
        // Update black player
        if (game.black === userId) {
          updatedEntry.black = username;
        } else {
          updatedEntry.black = await getOpponentName(game.black);
        }
        // Update white player
        if (game.white === userId) {
          updatedEntry.white = username;
        } else {
          updatedEntry.white = await getOpponentName(game.white);
        }
        // Update winner
        if (game.winner === userId) {
          updatedEntry.winner = username;
        } else if (game.winner !== null) {
          updatedEntry.winner = await getOpponentName(game.winner);
        }
  
        return updatedEntry;
      })
    );
    return updatedGames;
  };

  const navigate = useNavigate();

  const handleListItemSelect = (game) => {
    console.log('Navigating to game reivew with: ' + game.mode);
    // Navigate to GameReview component and pass selected game as a prop
    navigate('/gamereview', { state: { game } });
  };

  useEffect(() => {
    if (userId !== "") {
        // Fetch past games information when component mounts
        const fetchPastGames = async () => {
        try {
            const gamesData = await getPastGamesInformation(userId);
            setGames(gamesData);
        } catch (error) {
            console.error('Error fetching past games:', error);
        }
        };

        fetchPastGames();
    }
  }, [userId]);

  useEffect(() => {
    if (games.length !== 0) {
      // Fetch past games information when component mounts
      const fetchPastUpdatedGames = async () => {
        try {
          const gamesData = await updateGameEntries(games);
          setUpdatedGames(gamesData);
        } catch (error) {
          console.error('Error fetching past games:', error);
        }
      };
      fetchPastUpdatedGames();
    }
  }, [games]);

  return (
    <Box sx={{ width: '100%' }}>
      <h2>Game History</h2>
      <div style={{ maxHeight: '50vh', overflowY: 'auto', width: "100%" }}>
          {updatedGames.slice().reverse().map((game, index) => (
              <div key={index} style={{ height: "20%", width: "100%", borderBottom: '1px solid #ccc' }}>
                  <ListItemButton onClick={() => handleListItemSelect(game)}>
                      <ListItemText
                          primary={
                              <Typography variant="body1" style={{ fontWeight: "bold", textAlign: "center" }}>
                                  {game.mode}
                              </Typography>
                          }
                          secondary={
                              <React.Fragment>
                                  <Typography component="span" variant="body2" color="textPrimary">
                                      Players:
                                  </Typography>{' '}
                                  <br />
                                  <PersonIcon style={{ color: "white" }} /> {game.white}
                                  <br />
                                  <PersonIcon style={{ color: "black" }} /> {game.black}
                                  <br />
                                  <Typography component="span" variant="body2" color="textPrimary">
                                      Result:
                                  </Typography>
                                  <br />
                                  <PersonIcon style={{ color: game.winner ? (game.winner === game.white ? "white" : "black") : "grey" }} />
                                  {game.winner ? ` ${game.winner} Won` : ' Tie'}
                              </React.Fragment>
                          }
                      />
                  </ListItemButton>
              </div>
          ))}
      </div>
  </Box>
  );
};

export default GameHistory;
