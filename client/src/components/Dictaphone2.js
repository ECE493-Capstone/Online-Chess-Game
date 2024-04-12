/*
  This file serves the following FRs:
  FR30 - Handle.PieceVoiceMove
*/

import React, { useEffect, useState } from "react";
import VoiceMove from "./VoiceMove";
import { Button } from "@mui/material";
const Dictaphone2 = ({ getVoiceMoves, handleSetMove }) => {
  const [isListening, setIsListening] = useState(false);
  const voiceMove = new VoiceMove();
  useEffect(() => {
    const MOVES = getVoiceMoves();
    // const MOVES = chessboard.getMoves();
    if (isListening) {
      voiceMove.recognition.start();
    } else {
      voiceMove.recognition.stop();
    }

    voiceMove.recognition.onresult = (event) => {
      const data = voiceMove.recognizeMove(event, MOVES);
      handleSetStopListening(false);
      handleSetMove(data);
    };

    voiceMove.recognition.onerror = (event) => {
      console.log("Error occurred in recognition.");
    };

    voiceMove.recognition.onend = () => {
      console.log("Recognition ended.");
    };

    return () => {
      voiceMove.recognition.removeEventListener("result", (res) => {
        console.log(res);
      });
    };
  }, [isListening, voiceMove.recognition]);

  const startListening = () => {
    setIsListening(true);
  };

  const handleSetStopListening = () => {
    setIsListening(false);
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <div>
        <Button onClick={startListening} disabled={isListening}>
          Start Listening
        </Button>
      </div>
    </div>
  );
};

export default Dictaphone2;
