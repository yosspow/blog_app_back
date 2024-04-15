const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { login, register } = require("../controllers/userController");
router.use(express.urlencoded({ extended: true }));

// /login :post methode
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("email field should be a valid email format")
      .trim()
      .escape(),
    body("password")
      .isString()
      .withMessage("this field must be a string")
      .isLength({ min: 4, max: 8 })
      .withMessage("password field must be between 4 and 8 caracters")
      .trim()
      .escape(),
  ],
  login,
);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("temail field should be a valid email format")
      .trim()
      .notEmpty(),
    body("username")
      .isString()
      .withMessage("username must be string")
      .isLength({ min: 4, max: 20 })
      .withMessage("username must be between 4 and 20 characters")
      .trim()
      .notEmpty(),
    body("password")
      .isString()
      .withMessage("password field must be a string")
      .isLength({ min: 4, max: 8 })
      .withMessage("name must be between 4 and 8 characters")
      .trim(),
  ],
  register,
);

module.exports = router;
