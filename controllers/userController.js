const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();
async function login(req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(422)
      .json({ status: 422, results: {}, errors: error.errors });
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ results: {}, status: 404, message: "Invalid email/password" });
  }
  const isPassword = await bcrypt.compareSync(password, user.password);
  if (!isPassword) {
    return res
      .status(404)
      .json({ results: {}, status: 404, message: "Invalid email/Password!" });
  }

  const token = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.SECRECT_KEY,
    {
      expiresIn: "48h",
    },
  );
  res.status(200).json({
    results: user,
    status: 200,
    message: "authenticated success",
    token,
  });
}

async function register(req, res) {
  const { username, email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(422).json({
      errors: error.errors,
      status: 422,
      results: {},
      message: "required fields",
    });

  const ifUserExists = await User.findOne({ email: email });
  if (ifUserExists) {
    return res
      .status(409)
      .json({ status: 409, results: {}, msg: "Email already in use" });
  }
  const hashePasswrd = await bcrypt.hash(password, 10);
  const newUser = await new User({
    username,
    email,
    password: hashePasswrd,
  });

  newUser
    .save()
    .then(() => {
      res
        .status(201)
        .json({ results: newUser, status: 201, message: "new user created" });
    })
    .catch((err) => {
      res.status(422).json({
        errors: err.message,
        results: {},
        status: 422,
        message: "failed to sign up",
      });
    });
}

module.exports = { login, register };
