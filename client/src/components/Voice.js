import React, { useState } from "react";
import Dictaphone from "./Dictaphone";
import VoiceMove from "../lib/VoiceMove";
import Dictaphone2 from "./Dictaphone2";

const Voice = () => {
  const [input, setInput] = useState(null);
  const voiceMove = new VoiceMove();
  const getInput = (i) => {
    console.log(i);
    // phrases.forEach(())
    // console.log(voiceMove.matchMove(i));
    setInput(i);
  };
  return <Dictaphone2 />;
};

export default Voice;
