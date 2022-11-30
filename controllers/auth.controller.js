const UserModel = require("../models/user.model");
const { compareHash } = require("../helpers/encryption");
const { createToken } = require("../helpers/token");
const UserCtrl = require("./user.controller");

class authCtrl {
  static userLogin(req, res) {
    const { email, password } = req.body;

    // console.log("Req.body: ", req.body);

    UserModel.findOne({ email: email, status: 1 })
      .then((result) => {
        // console.log("Result: ", result);

        if (!result) throw new Error("Invalid Email");
        else if (compareHash(password, result.password)) {
          const accessToken = createToken(
            {
              _id: result._id,
              role: result.role,
            },
            60 * 10
          );
          // const refreshToken = createToken(
          //   {
          //     _id: result._id,
          //     role: result.role,
          //   },
          //   60 * 10
          // );
          // console.log("accessToken: ", accessToken);
          // console.log("refreshToken: ", refreshToken);
          res.set("x-access-token", accessToken);
          // res.set("x-refresh-token", refreshToken);
          res.status(200).send({
            message: "login successful",
            data: UserCtrl.pickUser(result),
          });
        } else {
          res.status(404).send({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(400)
          .send({ message: "Invalid email or user disabled", error: err });
      });
  }

  static validateToken(req, res) {
    const token = req.headers.authorization;

    // verify token
    const payload = verifyToken(token);

    if (payload?._id) {
      // token is valid
      const { _id } = payload;
      //get the user document from db
      UserModel.findOne({ _id })
        .then((result) => {
          res
            .status(200)
            .send({ data: UserCtrl.pickUser(result), message: "Valid Token" });
        })
        .catch((err) => {
          console.log(err);
          throw new Error("Invalid token");
        });
    } else {
      // invalid token
      res.status(403).send({ message: "Invalid Token", error: null });
    }
  } //validateToken
}

module.exports = authCtrl;


// testing purpose