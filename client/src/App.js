import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/pages/Main";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
