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
    profileImage: {
      type: String,
      required: false,
      default:
        "https://i.postimg.cc/8cjV8jSx/933-9332131-profile-picture-default-png.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
