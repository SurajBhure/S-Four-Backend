const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../config/envConfig");
const { verifyToken } = require("../tokenServices");

class Authorization {
  authorized(req, res, next) {
    // getting headers from token from category slice header.set
    const headerToken = req.headers.authorization;
    if (headerToken) {
      // console.log(headerToken);
      const token = headerToken.split("Bearer ")[1];
      // console.log("Token", token);  // check token reciving or not
      const verified = verifyToken(token);
      // console.log("verified", verified); // check verify token 
      if (verified) {
        //if vefiytoken is true then next method will call
        next();
      } else {
        return res
          .status(401)
          .send({ errors: [{ msg: "Please add valid token" }] });
      }
    } else {
      return res.status(401).send({
        errors: [{ msg: "unauthorised access || Please add auth token " }],
      });
    }
  }
}

module.exports = new Authorization();
