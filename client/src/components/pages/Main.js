import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    // navigate(`/game/${id}`);
  };
  return <button>Join Game</button>;
};

export default Main;
