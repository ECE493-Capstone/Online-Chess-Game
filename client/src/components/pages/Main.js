import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const Main = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    // navigate(`/game/${id}`);
  };
  return <Button variant="outlined">Join Game</Button>
};

export default Main;
