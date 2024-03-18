import React, { useEffect, useState } from "react";
import Chessboard from "../models/Chessboard";
import FuzzySet from "fuzzyset";
import VoiceMove from "../lib/VoiceMove";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
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
  const chessboard = new Chessboard();
  useEffect(() => {
    const MOVES = [];
    for (let i = 0; i < CHESS_POSITIONS.length; i++) {
      for (let j = 0; j < CHESS_POSITIONS.length; j++) {
        MOVES.push(CHESS_POSITIONS[i] + " " + CHESS_POSITIONS[j]);
      }
    }

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    const grammar = "";
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1000;
    const fzySet = FuzzySet(MOVES);
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const recognizedText = event.results[last][0].transcript;

      let result = recognizedText.toUpperCase();
      console.log(result, fzySet.get(result));
      let fzySetList = fzySet.get(result) || [];

      if (fzySetList.length > 0) {
        setTranscript(fzySetList[0][1]);
      } else {
        setTranscript("Unrecognized move");
      }
    };

    recognition.onerror = (event) => {
      console.log("Error occurred in recognition.");
    };

    recognition.onend = () => {
      console.log("Recognition ended.");
    };

    return () => {
      recognition.removeEventListener("result", (res) => {
        console.log(res);
      });
    };
  }, [isListening]);

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
