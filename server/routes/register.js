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
  const { username, email, password } = req.body;
  console.log(req.body);
  const userByEmail = await User.findOne({ email: email });
  const userByUsername = await User.findOne({ username: username });
  console.log(username, email, password);
  if (!(username && password)) {
    res.status(500);
    res.send("WTF");
  }
  if (userByEmail) {
    res.status(409);
    res.send({
      message: "An account exists with that email.",
    });
  } else if (userByUsername) {
    res.status(409);
    res.send({
      message: "An account exists with that username.",
    });
  } else {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
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
