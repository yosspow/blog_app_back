function isAdmin(req, res, next) {
  try {
    if (req.userRole === "admin") return next();

    res.status(403).json({
      results: {},
      status: 403,
      message: "You are not allowed to do this action",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ results: {}, status: 500, message: "Internal Server Error" });
  }
}
module.exports = isAdmin;
