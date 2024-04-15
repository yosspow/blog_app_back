const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    avatar: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", schema);

module.exports = User;
