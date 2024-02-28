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
