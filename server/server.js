const express = require("express");
const cors = require("cors");
const signinRoutes = require("./routes/login.js");
const registerRoutes = require("./routes/register.js");
const changeusernameRoutes = require("./routes/changeusername.js");
const changepasswordRoutes = require("./routes/changepassword.js");
const sessionRoutes = require("./routes/session.js");
const ongoingGamesRoutes = require("./routes/ongoingGames.js");
const pastGamesRoutes = require("./routes/pastGames.js");
const fetchuserRoutes = require("./routes/fetchuser.js");
const connect = require("./conn.js");
const http = require("http");
const bodyParser = require("body-parser");
const handleSocket = require("./socket/socketHandler.js");

const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
handleSocket(server);
app.use(express.json());
app.use(cors());
connect();
app.use("/signin", signinRoutes);
app.use("/signup", registerRoutes);
app.use("/fetchuser", fetchuserRoutes);
app.use("/changeusername", changeusernameRoutes);
app.use("/changepassword", changepasswordRoutes);
app.use("/session", sessionRoutes);
app.use("/games/ongoing", ongoingGamesRoutes);
app.use("/games/past", pastGamesRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
