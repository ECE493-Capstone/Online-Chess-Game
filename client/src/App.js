import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/pages/Main";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocket } from "./features/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const socket = io.connect("http://localhost:5050/");
  dispatch(setSocket(socket));
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
