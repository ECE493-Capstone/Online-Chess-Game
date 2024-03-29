import React, { useState, useEffect } from 'react';
import { MenuItem, Button, ButtonGroup, MenuList, Paper, Popper, Grow, ClickAwayListener } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'; // Import from 'recharts' instead of '@mui/x-charts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from "styled-components";
import { getPastGamesInformation } from '../api/pastGames';

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 5vh;
`;



// Sample game mode data. Hard-coded. Once they finish with the API for the actual data, I'll implement them.
const sampleGameModesData = {
  Classic: [
    { 
      name: "Wins",
      white: 6,
      black: 3
    },
    { 
      name: "Loses",
      white: 4,
      black: 2
    },
    { 
      name: "Ties",
      white: 2,
      black: 2
    },
  ],
  Blind: [
    { 
      name: "Wins",
      white: 3,
      black: 6
    },
    { 
      name: "Loses",
      white: 7,
      black: 1
    },
    { 
      name: "Ties",
      white: 5,
      black: 11
    },
  ],
  PowerUp: [
    { 
      name: "Wins",
      white: 9,
      black: 4
    },
    { 
      name: "Loses",
      white: 3,
      black: 3
    },
    { 
      name: "Ties",
      white: 2,
      black: 1
    },
  ]
};



const formatPastGamesData = async ({ userId }) => {
  try {
    // Retrieve past games information
    const gamesRetrieved = await getPastGamesInformation(userId);

    // Initialize an empty object to hold the formatted data
    const gameModesData = {};

    // Loop through each past game
    gamesRetrieved.forEach((game) => {
      // Check if the game mode exists in the formatted data
      if (!gameModesData.hasOwnProperty(game.mode)) {
        // If not, initialize an empty array for that game mode
        gameModesData[game.mode] = [];
      }

      // Push objects representing wins, losses, and ties for each game mode
      gameModesData[game.mode].push(
        {
          name: "Wins",
          white: game.winner === userId && game.white === userId ? 1 : 0,
          black: game.winner === userId && game.black === userId ? 1 : 0
        },
        {
          name: "Loses",
          white: game.winner !== userId && game.white === userId ? 1 : 0,
          black: game.winner !== userId && game.black === userId ? 1 : 0
        },
        {
          name: "Ties",
          white: game.tie && game.winner === null ? 1 : 0,
          black: game.tie && game.winner === null ? 1 : 0
        }
      );
    });

    return gameModesData;
  } catch (error) {
    // Handle errors if fetching past games information fails
    console.error("Error fetching past games:", error);
    return null; // Return null or handle the error appropriately
  }
};

const GameStatistics = ({userId}) => {
  const [open, setOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState('Classic');
  const [gameModesData, setGameModesData] = useState("");

  useEffect(() => {
    // setGameModesData(formatPastGamesData(userId));
    setGameModesData(sampleGameModesData);
  }, [userId]);



  const handleClick = () => {
    console.info(`You clicked ${selectedGameMode}`);
  };

  const handleMenuItemClick = (gameMode) => {
    setSelectedGameMode(gameMode);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const anchorRef = React.useRef(null);

  const selectedGameData = gameModesData[selectedGameMode];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: 'black', margin: '0' }}>{`${entry.name} : ${entry.value}`}</p>
          ))}
        </div>
      );
    }
  
    return null;
  };
  
  return (
    <PageContainer>
      <h2>Statistics for {selectedGameMode} Chess</h2>
      <BarChart
        width={400}
        height={300}
        data={selectedGameData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="white" fill="white" name="White" stackId="white" />
        <Bar dataKey="black" fill="black" name="Black" stackId="black" />
      </BarChart>

      <div>
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="Button group with a nested menu">
          <Button onClick={handleClick}>{selectedGameMode}</Button>
          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select game mode"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem id="split-button-menu">
                    {Object.keys(gameModesData).map((gameMode) => (
                      <MenuItem
                        key={gameMode}
                        selected={gameMode === selectedGameMode}
                        onClick={() => handleMenuItemClick(gameMode)}
                      >
                        {gameMode}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </PageContainer>
  );
};

export default GameStatistics;
