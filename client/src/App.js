// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Test from "./components/pages/Test";

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
