const express = require("express");
const User = require("../models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const router = express.Router();
const jsonParser = bodyParser.json();

router.post("/", jsonParser, async (req, res) => {
  const { identity, password } = req.body;
  const userByEmail = await User.findOne({ email: identity });
  const userByUsername = await User.findOne({ username: identity });
  if (userByEmail || userByUsername) {
    const user = userByEmail || userByUsername;
    if (bcrypt.compareSync(password, user.password)) {
      res.status(200);
      res.send({ userId: user.id, message: "login success" });
    } else {
      res.status(401);
      res.send({ errorField: "password", message: "Incorrect password" });
    }
  } else {
    res.status(401);
    res.send({ errorField: "login_cred", message: "No such username/email" });
  }
});

module.exports = router;
