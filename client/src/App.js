// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocket } from "./features/userSlice";
import Home from "./components/pages/Home";
import TestJoin from "./components/pages/TestJoin";
import Match from "./components/pages/Match";
import PrivateRoute from "./components/PrivateRoute";
import GameSelect from "./components/GameSelection";
import TimeSelect from "./components/TimeSelect";
import { socket } from "./app/socket";
import PlayType from "./components/PlayType";

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
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/timeselect" element={<TimeSelect />} />
          <Route path="/play-game" element={<PlayType />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-join" element={<TestJoin />} />
          <Route
            path="/match/:gameId"
            element={
              <PrivateRoute>
                <Match />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
