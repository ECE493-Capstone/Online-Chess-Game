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
      return bcrypt.hash(password, salt);
    })
    .catch((err) => console.error(err.message));
};

router.post("/", jsonParser, async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      // If user does not exist, send error response
      return res.status(404).json({ error: "User not found." });
    }
    console.log("User found.");

    // Check if old password matches
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      // If old password does not match, send error response
      return res.status(401).json({ error: "Incorrect old password." });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password with the new hashed password
    user.password = hashedPassword;

    // Save the updated user object
    await user.save();

    // Send success response
    res.status(200);

    res.send({ message: "Password changed successfully!" });
  } catch (error) {
    // If an error occurs, send internal server error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
