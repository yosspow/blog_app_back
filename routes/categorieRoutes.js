const express = require("express");
const router = express.Router();
const ensureToken = require("../middleware/ensureToken");
const isAdmin = require("../middleware/isAdmin");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
} = require("../controllers/categoryController");

const { body } = require("express-validator");

router
  .route("/")
  .get(getAllCategories)
  .post(
    ensureToken,
    [
      body("name")
        .isString()
        .withMessage(" Category name must be a string")
        .isLength({ min: 3, max: 25 })
        .withMessage(
          "Category name  must be at least 3 characters long or less than 25",
        )
        .trim()
        .escape(),
      body("description")
        .isLength({ min: 10 })
        .withMessage("desription must be at least 10 characters long")
        .isString()
        .withMessage("description must be a string")
        .trim()
        .escape(),
      body("image")
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage("Image must be a valid URL with HTTP or HTTPS protocol"),
    ],
    createCategory,
  );
router.get("/:name", getCategoryByName);
router.use(ensureToken);
router.use(isAdmin);
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
