// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import TimeSelect from "./components/TimeSelect";
import Match from "./components/pages/Match";
import GameSelect from "./components/GameSelection";
import Voice from "./components/Voice";
import Main from "./components/pages/Main";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocket } from "./features/userSlice";
import TestJoin from "./components/pages/TestJoin";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const dispatch = useDispatch();
  const socket = io.connect("http://localhost:5050/");
  console.log(socket.id);
  dispatch(setSocket(socket));
  const userId = useSelector((state) => state.user.userId);
  console.log(userId);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/timeselect" element={<TimeSelect />} />
          <Route path="/match" element={<Match />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/test-join" element={<TestJoin />} />
          <Route path="/match" element={<Match />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
