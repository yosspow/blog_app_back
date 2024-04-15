const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
function log(req, res, next) {
  const Baerertoken = req.headers["Authorization"];

  let logged = `- \`${req.url}\` - \`3abir sabil(non-Valid Token)\` \n `;
  if (!Baerertoken) {
    logged = ` - \`${req.url}\` || **${req.method}**||${new Date().toISOString().split(".")[0]}||(User :\`Guest\`)\n`;
  } else {
    const token = Baerertoken.split(" ")[1];
    jwt.verify(token, process.env.SECRECT_KEY, (err, data) => {
      logged = ` - \`${req.url}\` || **${req.method}**||${new Date().toISOString().split(".")[0]}||(User : \`${data.userId}\`)\n`;
    });
  }
  fs.appendFileSync("./log.md", logged);
  next();
}
module.exports = log;
