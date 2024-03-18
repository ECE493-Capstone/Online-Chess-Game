// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";
import TimeSelect from "./components/TimeSelect";
import Match from "./components/pages/Match";
import GameSelect from "./components/GameSelection";
import Voice from "./components/Voice";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
