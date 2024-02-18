const express = require("express");
const cors = require("cors");
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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
