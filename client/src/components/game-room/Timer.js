import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";

const TimerContainer = styled.div`
  border: 1px solid white;
  background-color: ${(props) => (props.isActive ? "#555555" : "black")};
  border-radius: 10px;
  max-width: fit-content;
  padding: 10px 10px;

  h3 {
    margin: 0;
    text-align: center;
    font-size: 1.5rem;
  }
`;

const Timer = ({ initTimeInMs, isActive, onTimeoutCb, newTime = -1 }) => {
  const DISPLAY_MS_THRESHOLD = 10000; // 10s

  const [time, setTime] = useState(initTimeInMs); // in milliseconds

  useEffect(() => {
    // if < 10s, update every 10ms, else every 1s
    if (newTime > time) {
      setTime(newTime);
      return;
    }

    if (!isActive) return;

    const delay = time < DISPLAY_MS_THRESHOLD ? 10 : 1000;
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          onTimeoutCb();
          return 0;
        }
        return prevTime - delay;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isActive, initTimeInMs, onTimeoutCb, time, newTime]);

  const formatTime = (ms) => {
    if (ms < DISPLAY_MS_THRESHOLD) {
      const seconds = (ms % 60000) / 1000;
      return `${seconds.toFixed(2)}`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  };

  return (
    <TimerContainer isActive={isActive}>
      <h3>{formatTime(time)}</h3>
    </TimerContainer>
  );
};

export default Timer;
