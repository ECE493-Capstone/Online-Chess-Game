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

// Sample game mode data. Hard-coded.
const sampleGameModesData = {
  Classic: [{ name: "Wins", white: 6, black: 3 }, { name: "Loses", white: 4, black: 2 }, { name: "Ties", white: 2, black: 2 }],
  Blind: [{ name: "Wins", white: 3, black: 6 }, { name: "Loses", white: 7, black: 1 }, { name: "Ties", white: 5, black: 11 }],
  PowerUp: [{ name: "Wins", white: 9, black: 4}, { name: "Loses", white: 3, black: 3 }, { name: "Ties", white: 2, black: 1 }]
};

const formatPastGamesData = async (userId, setGameModesData) => {
  try {

    const gamesRetrieved = await getPastGamesInformation(userId);

    const formattedData = {
      Classic: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }],
      Blind: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }],
      PowerUp: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }]
    };

    const gameModeDataMap = {
      Classic: formattedData.Classic,
      Blind: formattedData.Blind,
      PowerUp: formattedData.PowerUp
    };


    gamesRetrieved.forEach((game) => {
      const isWinner = game.winner === userId;
      const isLoser = game.winner && game.winner !== userId;
      const isTie = game.tie && game.winner === null;
      const isWhite = game.white === userId;
    
      const modeData = gameModeDataMap[game.mode];
    
      if (isWinner) {
        if (isWhite) {
          modeData.find(item => item.name === "Wins").white++;
        } else {
          modeData.find(item => item.name === "Wins").black++;
        }
      } else if (isLoser) {
        if (isWhite) {
          modeData.find(item => item.name === "Loses").white++;
        } else {
          modeData.find(item => item.name === "Loses").black++;
        }
      } else if (isTie) {
        if (isWhite) {
          modeData.find(item => item.name === "Ties").white++;
        } else {
          modeData.find(item => item.name === "Ties").black++;
        }
      }
    });

    // Update state with the formatted data
    setGameModesData(formattedData);

  } catch (error) {
    // Handle errors if fetching past games information fails
    console.error("Error fetching past games:", error);
    if (error.response && error.response.status === 404) {
      // Create game data structure with all fields being 0
      const emptyData = {
        Classic: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }],
        Blind: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }],
        PowerUp: [{ name: "Wins", white: 0, black: 0 }, { name: "Loses", white: 0, black: 0 }, { name: "Ties", white: 0, black: 0 }]
      };
      // Update state with empty data
      setGameModesData(emptyData);
    } else {
      // Return null or handle the error appropriately
      return null;
    }
  }
};


const GameStatistics = ({userId}) => {
  const [open, setOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState('Classic');
  const [gameModesData, setGameModesData] = useState("");

  useEffect(() => {
    if (userId !== "") {
      console.log("Game statistics detect user id: " + userId);
      formatPastGamesData(userId, setGameModesData);
      // setGameModesData(sampleGameModesData);
    }
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
