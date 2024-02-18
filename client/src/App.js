import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/pages/Main";
import { useSelector } from "react-redux";

const App = () => {
  const userId = useSelector((state) => state.user.userId);
  console.log(userId);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
