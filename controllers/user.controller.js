const UserModel = require("../models/user.model");

class UserCtrl {
  static createUser(req, res) {
    const user = req.body;
    console.log("User: ", req.body);

    new UserModel(user)
      .save()
      .then((result) => {
        res.status(201).send({ message: "User created", data: result });
      })
      .catch((err) => {
        console.error(err);
        // console.log("Error: ", err);
      });
  } //createUser
  static updateUser(req, res) {} //updateUser
  static deleteUser(req, res) {} //deleteUser
  static fetchOneUser(req, res) {} //fetchOneUser
  static fetchAllUser(req, res) {} //fetchAllUser
}

module.exports = UserCtrl;