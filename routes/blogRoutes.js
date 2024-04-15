const express = require("express");
const router = express.Router();
const {
  allblogs,
  add,
  update,
  remove,
  blogById,
  likeBlog,
} = require("../controllers/blogController");
const ensureToken = require("../middleware/ensureToken");
const isAllowed = require("../middleware/isAllowed");
const { body } = require("express-validator");

router
  .route("/")
  .get(allblogs)
  .post(
    ensureToken,
    [
      body("content")
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters long")
        .isString()
        .withMessage("Content must be a string")
        .trim()
        .escape(),

      body("title")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 4, max: 50 })
        .withMessage(
          "Blog title must be at least 4 characters and less that 50",
        ),

      body("image")
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage("Image must be a valid URL with HTTP or HTTPS protocol"),
    ],
    add,
  );

router
  .route("/:id")
  .get(blogById)
  .put(
    ensureToken,
    isAllowed,
    [
      body("content")
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters long")
        .isString()
        .withMessage("Content must be a string")
        .trim()
        .escape(),

      body("title")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 4, max: 50 })
        .withMessage(
          "Blog title must be at least 4 characters and less that 50",
        ),

      body("image")
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage("Image must be a valid URL with HTTP or HTTPS protocol"),
    ],
    update,
  )
  .delete(ensureToken, isAllowed, remove)
  .patch(ensureToken, likeBlog);

module.exports = router;
