const express = require("express");
const auth = require("./routes/auth.js");
const profileRoutes = require("./routes/profileRoutes");
const categorieRoutes = require("./routes/categorieRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
const cors = require("cors");
const Connect = require("./src/database");
const log = require("./middleware/log.js");
const app = express();
const port = 8080;
const errHandler = require("./middleware/errHandler.js");
const notFound = require("./middleware/pageNotFound.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser());
app.use(express.json());

Connect();

app.use(log);
app.use("/auth", auth);
app.use("/blogs", blogRoutes);
app.use("/categories", categorieRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ results: {}, status: 200, message: "welcome user go to /login" });
});

app.use(notFound);
app.use(errHandler);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
//
