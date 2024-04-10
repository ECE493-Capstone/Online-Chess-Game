// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import { useSelector } from "react-redux";
import Home from "./components/pages/Home";
import TestJoin from "./components/pages/TestJoin";
import Match from "./components/pages/Match";
import PrivateRoute from "./components/PrivateRoute";
import GameSelect from "./components/GameSelection";
import TimeSelect from "./components/TimeSelect";
import { socket } from "./app/socket";
import Profile from "./components/pages/Profile";
import { Toaster } from "react-hot-toast";
import BlindChess from "./components/BlindChess/BlindChess";
import BlindChessInstructions from "./components/BlindChess/BlindChessInstructions";
import GameReview from "./components/pages/GameReview";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const userId = useSelector((state) => state.user.userId);
  console.log(userId);
  socket.on("reconnect", () => {
    console.log("reconnected");
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <Toaster />
      </div>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/timeselect" element={<TimeSelect />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-join" element={<TestJoin />} />
          <Route path="/match/:gameId" element={<Match />} />
          <Route path="/timeselect" element={<TimeSelect />} />
          <Route path="/match" element={<Match />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/blindchess" element={<BlindChessInstructions />} />
          <Route path="/profile/gamereview/:gameId" element={<GameReview />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
