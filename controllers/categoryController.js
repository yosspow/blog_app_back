const Category = require("../models/Category");
const Blog = require("../models/Blog");
const { validationResult } = require("express-validator");

exports.createCategory = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ errors: error.errors });
  }
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      results: category,
      status: 201,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(409).json({
      error: error.message,
      status: 409,
      message: "something went wrong",
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().limit(req.query.n);
    res.status(200).json({
      results: categories,
      status: 200,
      message: "Categories fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      results: {},
      status: 500,
      message: "Internal server error",
    });
  }
};

// Get a single category by ID
exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });

    if (!category) {
      return res
        .status(404)
        .json({ results: {}, status: 404, message: "Category not found" });
    }

    const blogs = await Blog.aggregate([
      { $match: { categoryId: category._id } }, // Match documents with the specified category ID
      { $sample: { size: 100 } }, // Sample 100 random documents
    ]);

    res.status(200).json({
      results: { category, blogs },
      status: 200,
      message: "Category retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      results: {},
      status: 500,
      message: "Internal server error",
    });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res
        .status(404)
        .json({ results: {}, status: 404, message: "Category not found" });
    }
    res.json({
      results: category,
      status: 200,
      message: "Category updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      results: {},
      status: 400,
      message: "something went wrong",
    });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ results: {}, status: 404, message: "Category not found" });
    }
    res.status(200).json({
      results: category,
      status: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      results: {},
      status: 500,
      message: "Internal server error",
    });
  }
};
