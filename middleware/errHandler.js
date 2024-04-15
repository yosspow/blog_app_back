function errHandler(err, req, res, next) {
  console.log(err);
  res.status(500).json({ results: {}, status: 500, message: "Server error" });
}

module.exports = errHandler;
