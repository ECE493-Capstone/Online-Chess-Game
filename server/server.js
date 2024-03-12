const express = require("express");
const cors = require("cors");
const signinRoutes = require("./routes/login.js");
const registerRoutes = require("./routes/register.js");
// const sessionRoutes = require("./routes/session.js");
const gameRoutes = require("./routes/games.js");
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
// app.use("/session", sessionRoutes);
app.use("/game", gameRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
