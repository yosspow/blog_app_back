const Blog = require("../models/Blog");

async function isAllowed(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (blog.userId == req.userId || req.userRole == "admin") {
      req.blogId = blog._id;
      next();
    } else {
      return res.status(401).json({
        results: {},
        status: 401,
        message: "You are not allowed to do this action",
      });
    }
  } catch (err) {
    return res
      .status(404)
      .json({ results: {}, status: 404, message: "blog does not exist" });
  }
}

module.exports = isAllowed;
