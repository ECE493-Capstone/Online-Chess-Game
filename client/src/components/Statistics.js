import React, { useState } from "react";
import {
  MenuItem,
  Button,
  ButtonGroup,
  MenuList,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"; // Import from 'recharts' instead of '@mui/x-charts'
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 30vw;
  gap: 5vh;
  .select-form {
    width: 40%;
    border: solid 1px #00abe3;
  }
`;

// Sample game mode data. Hard-coded. Once they finish with the API for the actual data, I'll implement them.
const gameModesData = {
  Classic: [{ win: 10, lose: 5, tie: 3 }],
  Blind: [{ win: 7, lose: 8, tie: 2 }],
  PowerUp: [{ win: 15, lose: 3, tie: 1 }],
};

const GameStatistics = () => {
  const [open, setOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState("Classic");

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
        <div
          style={{
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${index}`}
              style={{ color: "black", margin: "0" }}
            >{`${entry.name} : ${entry.value}`}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <PageContainer>
      <BarChart
        width={400}
        height={300}
        data={selectedGameData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="gameMode" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="win" fill="#22a186" name="Win" />
        <Bar dataKey="tie" fill="#D3D3D3" name="Tie" />
        <Bar dataKey="lose" fill="#d54f68" name="Lose" />
      </BarChart>
      <FormControl className="select-form">
        <InputLabel id="demo-simple-select-label">Game Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedGameMode}
          label="Game mode"
          onChange={(e) => setSelectedGameMode(e.target.value)}
        >
          <MenuItem value={"Classic"}>Classic</MenuItem>
          <MenuItem value={"Blind"}>Blind</MenuItem>
          <MenuItem value={"PowerUp"}>PowerUp</MenuItem>
        </Select>
      </FormControl>
    </PageContainer>
  );
};

export default GameStatistics;
