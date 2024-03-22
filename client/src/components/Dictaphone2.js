import React, { useEffect, useState } from "react";
import Chessboard from "../models/Chessboard";
import FuzzySet from "fuzzyset";
import VoiceMove from "../lib/VoiceMove";
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

const Dictaphone2 = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const voiceMove = new VoiceMove();
  useEffect(() => {
    const MOVES = [
      "a 7 to a 6",
      "alpha 7 to alpha 6",
      "a 7 to a 5",
      "alpha 7 to alpha 5",
      "b 7 to b 6",
      "bravo 7 to bravo 6",
      "b 7 to b 5",
      "bravo 7 to bravo 5",
      "c 7 to c 6",
      "charlie 7 to charlie 6",
      "c 7 c 5",
      "charlie 7 to charlie 5",
      "d 7 d 6",
      "delta 7 to delta 6",
      "d 7 d 5",
      "delta 7 to delta 5",
      "e 7 e 6",
      "echo 7 to echo 6",
      "e 7 e 5",
      "echo 7 to echo 5",
      "f 7 f 6",
      "fox 7 to fox 6",
      "f 7 f 5",
      "fox 7 to fox 5",
      "g 7 g 6",
      "golf 7 to golf 6",
      "g 7 g 5",
      "golf 7 to golf 5",
      "h 7 h 6",
      "hotel 7 to hotel 6",
      "h 7 h 5",
      "hotel 7 to hotel 5",
      "b 8 a 6",
      "bravo 8 to alpha 6",
      "b 8 c 6",
      "bravo 8 to charlie 6",
      "g 8 f 6",
      "golf 8 to fox 6",
      "g 8 h 6",
      "golf 8 to hotel 6",
      "King side castle",
      "Queen side castle",
    ];
    // const MOVES = chessboard.getMoves();
    if (isListening) {
      voiceMove.recognition.start();
    } else {
      voiceMove.recognition.stop();
    }

    voiceMove.recognition.onresult = (event) => {
      const data = voiceMove.recognizeMove(event, MOVES);
      console.log(data);
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
        <button onClick={startListening} disabled={isListening}>
          Start Listening
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          Stop Listening
        </button>
      </div>
      <div>
        <p>Recognized Text: {transcript}</p>
      </div>
    </div>
  );
};

export default Dictaphone2;
