// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocket } from "./features/userSlice";
import TestJoin from "./components/pages/TestJoin";
import Match from "./components/pages/Match";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/pages/Home";
import TimeSelect from "./components/TimeSelect";
import GameSelect from "./components/GameSelection";
import Profile from "./components/pages/Profile";

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
          <Route path="/test-join" element={<TestJoin />} />
          <Route
            path="/match"
            element={
              <PrivateRoute>
                <Match />
              </PrivateRoute>
            }
          />
          <Route path="/timeselect" element={<TimeSelect />} />
          <Route path="/match" element={<Match />} />
          <Route path="/gameselect" element={<GameSelect />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
