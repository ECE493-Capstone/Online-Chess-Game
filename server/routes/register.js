const express = require("express");
const User = require("../models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const router = express.Router();
const jsonParser = bodyParser.json();

const hashPassword = async (password) => {
  return bcrypt
    .genSalt(10)
    .then((salt) => {
      console.log("SALT");
      return bcrypt.hash(password, salt);
    })
    .catch((err) => console.error(err.message));
};

router.post("/", jsonParser, async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  console.log(req.body);
  const userByEmail = await User.findOne({ email: email });
  const userByUsername = await User.findOne({ username: username });
  console.log(firstName, lastName, username, email, password);
  if (!(firstName && lastName && username && email && password)) {
    res.status(500);
    res.send("WTF");
  }
  if (userByEmail) {
    res.status(409);
    res.send({
      message: "An account exists with that email. Please Sign in.",
    });
  } else if (userByUsername) {
    res.status(409);
    res.send({
      message: "An account exists with that username. Please Sign in.",
    });
  } else {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
    const saveResult = newUser.save();
    console.log(`Registerd ${saveResult}`);
    res.status(200);
    res.send({
      message: "Sign up successful.",
    });
  }
});
module.exports = router;
