const express = require("express");
const User = require("../models/User");
const bodyParser = require("body-parser");
const router = express.Router();

const jsonParser = bodyParser.json();

router.post("/", jsonParser, async (req, res) => {
  const { id: userId } = req.body;
  console.log("WTF", userId);
  try {
    const userById = await User.findById(userId);
    if (userById) {
      res.status(200).send({
        username: userById.username,
        email: userById.email, // Corrected to retrieve user's email
        message: "found user.",
      });
    } else {
      res.status(404).send({
        errorField: "not_found",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/byName", jsonParser, async (req, res) => {
  const { username } = req.body;

  // Check if the username field is missing or empty
  if (!username) {
    return res.status(400).send({
      errorField: "bad_request",
      message: "Username is required",
    });
  }

  try {
    const userByUsername = await User.findOne({ username: username });
    if (userByUsername) {
      res.status(200).send({
        userId: userByUsername._id, // Add userId to the response
        username: userByUsername.username,
        email: userByUsername.email,
        password: userByUsername.password,
        message: "login success",
      });
    } else {
      res.status(404).send({
        errorField: "not_found",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.delete("/removeName", jsonParser, async (req, res) => {
  const { username } = req.body;

  // Check if the username field is missing or empty
  if (!username) {
    return res.status(400).send({
      errorField: "bad_request",
      message: "Username is required",
    });
  }

  try {
    const userByUsername = await User.findOneAndDelete({ username: username });
    if (userByUsername) {
      res.status(200).send({
        message: "User removed successfully",
      });
    } else {
      res.status(404).send({
        errorField: "not_found",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
