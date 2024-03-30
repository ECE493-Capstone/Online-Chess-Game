import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: fit-content;
  padding: 10px 10px;

  h3 {
    margin: 0;
    text-align: center;
    font-size: 1.5rem;
  }
`;

const Timer = ({ seconds }) => {
  const [time, setTime] = useState(seconds); // in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <Container>
      <h3>{formatTime(time)}</h3>
    </Container>
  );
};

export default Timer;
