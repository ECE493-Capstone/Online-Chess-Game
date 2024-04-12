/*
  This file serves the following FRs:
  FR1 - Request.Registration
  FR2 - Request.Login
  FR3 - Change.Password
  FR4 - Change.Username
  FR32 - View.Statistics
*/
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  { collection: "users" }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
