const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxLength: 255,
    },
    profile: {
      type: String,
      required: true,
      maxLength: 1000,
      default: "https://i.postimg.cc/CxXFkpg0/abstract-user-flat-4.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
