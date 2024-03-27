import React, { useState } from 'react';
import { Menu, MenuItem, Button, ButtonGroup, MenuList, Paper, Popper, Grow, ClickAwayListener } from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'; // Import from 'recharts' instead of '@mui/x-charts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 30vw;
  gap: 5vh;
`;

// Sample game mode data. Hard-coded. Once they finish with the API for the actual data, I'll implement them.
const gameModesData = {
  Classic: [
    { win: 10, lose: 5, tie: 3 }
  ],
  Blind: [
    { win: 7, lose: 8, tie: 2 }
  ],
  PowerUp: [
    { win: 15, lose: 3, tie: 1 }
  ]
};

const GameStatistics = () => {
  const [open, setOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState('Classic');

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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="gameMode" />
        <YAxis />
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
        <Bar dataKey="win" fill="black" name="Win" />
        <Bar dataKey="lose" fill="white" name="Lose" />
        <Bar dataKey="tie" fill="gray" name="Tie" />
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
