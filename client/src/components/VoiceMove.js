/*
  This file serves the following FRs:
  FR30 - Handle.PieceVoiceMove
*/

import FuzzySet from "fuzzyset";
import {
  CHESS_POSITIONS,
  NUMBER_WORDS,
  WORDS_NUMBER,
} from "../constants/BoardConstants";
export default class VoiceMove {
  Pieces = [
    { id: 1, name: "Pawn" },
    { id: 2, name: "Rook" },
    { id: 3, name: "Knight" },
    { id: 4, name: "Bishop" },
    { id: 5, name: "Queen" },
    { id: 6, name: "King" },
  ];

  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;
    this.recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    const grammar = this.generateGrammar();
    speechRecognitionList.addFromString(grammar, 1);
    this.recognition.grammars = speechRecognitionList;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1000;

    this.recognition.onerror = (event) => {
      console.log("Error occurred in recognition.");
    };

    this.recognition.onend = () => {
      console.log("Recognition ended.");
    };
  }

  generateGrammar() {
    let moveRules = " | short castle | long castle";
    const grammar =
      "#JSGF V1.0; grammar chess; public <chess_position> = " +
      CHESS_POSITIONS.join(" | ") +
      " ; public <chess_move> = <chess_position> TO <chess_position>;" +
      moveRules;
    return grammar;
  }

  recognizeMove(event, moves) {
    const fzySet = FuzzySet(moves);
    const last = event.results.length - 1;
    const recognizedText = event.results[last][0].transcript;

    let result = recognizedText.toLowerCase();
    console.log("LIstenign: ", result);

    let result_split = result.split(" ");
    result_split.forEach((word, index) => {
      if (word in NUMBER_WORDS) {
        result_split[index] = NUMBER_WORDS[word];
      }
    });
    result = result_split.join(" ");
    let fzySetList = fzySet.get(result) || [];
    try {
      if (fzySetList.length > 0) {
        const result = fzySetList[0][1].split(" ");
        let fromCol = String.fromCharCode(result[0][0].charCodeAt(0) - 49);
        let fromRow = 8 - parseInt(WORDS_NUMBER[result[1]]);
        let toCol = String.fromCharCode(result[3][0].charCodeAt(0) - 49);
        let toRow = 8 - parseInt(WORDS_NUMBER[result[4]]);
        console.log(
          "Move recognized: ",
          result[0],
          result[1],
          result[3],
          result[4]
        );
        return {
          move: {
            fromRow: parseInt(fromRow),
            fromCol: parseInt(fromCol),
            toRow: parseInt(toRow),
            toCol: parseInt(toCol),
          },
          name: `${result[0][0]}${WORDS_NUMBER[result[1]]} to ${result[3][0]}${
            WORDS_NUMBER[result[4]]
          }`,
          voiceNotation1: fzySetList[0][1],
          voiceNotation2: `${result[0][0]}${result[1]} to ${result[3][0]}${result[4]}`,
        };
      }
    } catch (err) {
      console.log("Error in recognizing move: ", err);
    }
    return null;
  }
  generateMoves() {
    const numbers = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
    ];
    const pieces = ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"];
    const letters = "abcdefgh";
    const moves = [];
    let counter = 1;
    for (let i = 0; i < pieces.length; i++) {
      for (let j = 1; j <= 8; j++) {
        for (let k = 1; k <= 8; k++) {
          moves.push({
            id: counter,
            name: `${pieces[i]} to ${letters[j]} ${numbers[k]}`,
          });
          counter++;
        }
      }
    }
    return moves;
  }
}
