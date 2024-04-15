// this is a simple express js project using json for crud application

const express = require("express");
const Router = express.Router();

const {
  show,
  add,
  update,
  remove,
  profile,
  addPage,
} = require("../controllers/blogController");
const { turnToAdmin, turnToAdminPage } = require("../controllers/adminSetup");
const ensureToken = require("../middleware/ensureToken");
const isAllowed = require("../middleware/isAllowed");

Router.use(ensureToken);

Router.route("/turn-admin").get(turnToAdminPage).post(turnToAdmin);

Router.get("/", profile);
Router.get("/blogs", show);

module.exports = Router;
