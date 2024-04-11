import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "../../app/socket";

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

const Timer = ({
  type,
  side,
  isActive,
  defaultTime,
  onTimeoutCb,
  newTime = -1,
}) => {
  const [timer, setTimer] = useState(defaultTime);
  useEffect(() => {
    if (side === "w") {
      socket.on("whiteTime", (data) => {
        if (data <= 0) {
          onTimeoutCb();
        }
        setTimer(Math.max(data, 0));
      });
    } else if (side === "b") {
      socket.on("blackTime", (data) => {
        if (data <= 0) {
          onTimeoutCb();
        }
        setTimer(Math.max(data, 0));
      });
    }
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <TimerContainer id="timer-container" timer={formatTime(timer)} isActive={isActive}>
      <h3>{formatTime(timer)}</h3>
    </TimerContainer>
  );
};

export default Timer;
