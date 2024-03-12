import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/pages/Main";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./features/userSlice";
import TestJoin from "./components/pages/TestJoin";
import Match from "./components/pages/Match";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./app/socket";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("IS CONNECTED");
      setSocket({ payload: true });
    });
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-join" element={<TestJoin />} />
          <Route path="/game/:id" element={<Match />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
