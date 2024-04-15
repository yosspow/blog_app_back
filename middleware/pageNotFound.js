function notFound(req, res) {
  res
    .status(404)
    .json({ results: {}, status: 404, message: "page does Not exist" });
}
module.exports = notFound;
