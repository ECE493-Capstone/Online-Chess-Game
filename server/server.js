const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const signinRoutes = require("./routes/login.js");
const registerRoutes = require("./routes/register.js");
const sessionRoutes = require("./routes/session.js");
const connect = require("./conn.js");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());
connect();
app.use("/signin", signinRoutes);
app.use("/signup", registerRoutes);
app.use("/session", sessionRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected successfully");
  socket.on("abcd", (data) => {
    io.to(data.id).emit("msgReceived", `Msg received ${data.id}`);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
