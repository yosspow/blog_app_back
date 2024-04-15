const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
async function getUser(userId) {
  const user = await User.findOne({ _id: userId });
  return user;
}
async function allblogs(req, res) {
  const blogs = await Blog.find().populate(["userId", "categoryId"]);

  const totalBlogs = blogs.length;
  const remainder = totalBlogs % 4;
  const chunkSize = Math.floor(totalBlogs / 4);
  const chunks = Array.from({ length: 4 }, (_, index) => {
    const chunkStart = index * chunkSize + Math.min(index, remainder);
    const chunkEnd = chunkStart + chunkSize + (index < remainder ? 1 : 0);
    return blogs.slice(chunkStart, chunkEnd);
  });
  return res.status(200).json({
    results: blogs,
    status: 200,
    message: "blogs fetched succesfully",
  });
}
async function show(req, res) {
  Blog.find({ userId: req.userId })
    .populate(["userId", "categoryId"])
    .then((blogs) => {
      const totalBlogs = blogs.length;
      const remainder = totalBlogs % 4;
      const chunkSize = Math.floor(totalBlogs / 4);
      const chunks = Array.from({ length: 4 }, (_, index) => {
        const chunkStart = index * chunkSize + Math.min(index, remainder);
        const chunkEnd = chunkStart + chunkSize + (index < remainder ? 1 : 0);
        return blogs.slice(chunkStart, chunkEnd);
      });

      const totalLikes = blogs.reduce((prev, curr) => {
        return prev + curr.likes;
      }, 0);

      res.status(200).json({
        results: { blogs: chunks, likes: totalLikes },
        status: 200,
        message: "blogs fetched successfully",
      });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
}
async function blogById(req, res) {
  const { id } = req.params;
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const blog = await Blog.findById(objectId).populate([
      "userId",
      "categoryId",
    ]);
    if (!blog)
      return res
        .status(404)
        .json({ message: "The blog with the given ID was not found." });

    const relatedBlogs = await Blog.aggregate([
      { $match: { categoryId: blog.categoryId._id, _id: { $ne: objectId } } },
      { $sample: { size: 4 } },
    ]);
    blog.visits++;
    await blog.save();
    return res.status(200).json({
      results: { blog, relatedBlogs },
      status: 200,
      message: "Blog found!",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message, status: 500, message: "Server eror" });
  }
}

async function profile(req, res) {
  try {
    const user = await getUser(req.userId);

    res.status(200).json({
      results: user,
      status: 200,
      message: `welcome ${user.name} role : ${user.role}`,
    });
  } catch {
    res.status(500).json({ status: 500, error: "server Error !" });
  }
}
async function likeBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "blog does not exist" });
    }
    blog.likedby = [...blog.likedby, req.userId];
    blog.likes++;
    const result = await blog.save();
    res.status(200).json({ message: "like added", result: result });
  } catch {
    res.status(500).json({ status: 500, error: "server Error !" });
  }
}

async function add(req, res) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ errors: error.errors });
    }
    const user = await getUser(req.userId);
    const { title, content, categoryId, image } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ status: 400, message: "All fields are required" });
    }
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category Not Found" });
    category.blogsCount++;
    await category.save();
    const newblog = new Blog({
      title,
      content,
      userId: user._id,
      image,
      categoryId: categoryId,
    });

    newblog
      .save()
      .then((blog) => {
        res.status(201).json({
          results: blog,
          status: 201,
          message: "blog has been added!",
        });
      })
      .catch((err) => {
        res
          .status(422)
          .json({ error: err.message, status: 422, message: "Invalid data!" });
      });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      status: 500,
      message: "Internal server error",
    });
  }
}

async function update(req, res) {
  const { title, content, image, categoryId } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ errors: error.errors });
  }
  Blog.findOneAndUpdate(
    { _id: req.blogId },
    {
      $set: {
        title,
        content,
        image,
        categoryId,
      },
    },
  )
    .populate("categoryId")
    .then((blog) => {
      return res.json({ message: "blog Updated! succesfully" });
    })
    .catch((err) => {
      return res.status(422).json({ message: err.message });
    });
}

async function remove(req, res) {
  Blog.findOneAndDelete({ _id: req.blogId })
    .then((blog) => {
      return res.json({ message: "blog deleted!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
}

module.exports = {
  show,
  add,
  update,
  remove,
  profile,
  allblogs,
  blogById,
  likeBlog,
};
