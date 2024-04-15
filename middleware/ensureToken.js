const jwt = require("jsonwebtoken");
require("dotenv").config();
function ensureToken(req, res, next) {
  // header should be sent from the front end  as 'Authorization' not 'authorization'

  const Baerertoken = req.headers["authorization"];

  if (typeof Baerertoken !== "undefined") {
    const token = Baerertoken.split(" ")[1];

    jwt.verify(token, process.env.SECRECT_KEY, (err, data) => {
      if (err) {
        return res
          .status(401)
          .send({ results: {}, status: 401, message: "Sign Up first" });
      }

      req.userId = data.userId;
      req.userRole = data.userRole;
      next();
    });
  } else {
    return res
      .status(401)
      .send({ results: {}, status: 401, message: "Sign Up first" });
  }
}
module.exports = ensureToken;
