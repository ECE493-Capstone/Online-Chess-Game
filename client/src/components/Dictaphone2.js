import React, { useEffect, useState } from "react";
import VoiceMove from "./VoiceMove";
import { Button } from "@mui/material";
const CHESS_POSITIONS = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "E1",
  "E2",
  "E3",
  "E4",
  "E5",
  "E6",
  "E7",
  "E8",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "H7",
  "H8",
];

const Dictaphone2 = ({ getVoiceMoves, handleSetMove }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
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

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <div>
        <Button onClick={startListening} disabled={isListening}>
          Start Listening
        </Button>
        <Button onClick={stopListening} disabled={!isListening}>
          Stop Listening
        </Button>
      </div>
    </div>
  );
};

export default Dictaphone2;
