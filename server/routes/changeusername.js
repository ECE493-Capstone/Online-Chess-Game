const express = require("express");
const User = require("../models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const router = express.Router();
const jsonParser = bodyParser.json();

router.post("/", jsonParser, async (req, res) => {
  const { email, password, newUsername } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      // If user does not exist, send error response
      return res.status(404).json({ error: "User not found." });
    }

    // Check if old password matches
    if (!bcrypt.compareSync(password, user.password)) {
      // If old password does not match, send error response
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Check if the new username matches
    if (bcrypt.compareSync(newUsername, user.username)) {
        // If new username matches, send error response
        return res.status(401).json({ error: "New username is the same as old one." });
    }

    // Update user's password with the new hashed password
    user.username = newUsername;

    // Save the updated user object
    await user.save();

    // Send success response
    res.status(200);

    res.send({message: "Username changed successfully!"});

  } catch (error) {
    // If an error occurs, send internal server error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;