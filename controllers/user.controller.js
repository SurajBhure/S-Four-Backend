const {
  encryption,
  compareHash,
  hashedPassword,
} = require("../helpers/encryption");
const UserModel = require("../models/user.model");
const _ = require("lodash");
const { validationResult } = require("express-validator");
const { createToken } = require("../helpers/tokenServices");

class UserCtrl {
  static pickUser(user) {
    return _.pick(user, [
      "name",
      "mobile",
      "email",
      "avatar",
      "_id",
      "createdAt",
      "userId",
      "admin",
    ]);
  }

  // POST /api/register
  // @access Public
  // @desc Create user and return a token
  static createUser(req, res) {
    //validation by express-validators
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      //if the validation passed then the input data will goes to req.body
      const user = req.body; // const { name, mobile, email, password } = req.body;
      console.log("User: ", user);
      console.log("req-file: ", req.file);
      // if req contains password then encrpt it
      if (user.password) user.password = encryption(user.password);

      if (req.file) user.avatar = req?.file?.filename;
      console.log("User: ", user);
      new UserModel(user)
        .save()
        .then((result) => {
          const token = createToken({ id: result._id, name: result.name });
          console.log("testing result", result);
          res.status(201).send({
            message: "User created",
            data: UserCtrl.pickUser(result),
            token,
          });
        })
        .catch((err) => {
          console.error(err);
          // console.log("Error: ", err);
          res.status(500).send({ message: "user not created", error: err });
        });
    }
  } //createUser
  static updateUser(req, res) {
    const { id } = req.params;
    const user = req.body;

    UserModel.findOneAndUpdate({ _id: id }, user, { new: true })
      .then((result) => {
        res.status(200).send({ message: "User updated", data: result });
      })
      .catch((err) => {
        console.error(err);
        // console.log("Error: ", err);
        res.status(500).send({ message: "user not updated", error: err });
      });
  } //updateUser
  static deleteUser(req, res) {
    const { id } = req.params;

    UserModel.findOneAndDelete({ _id: id }, { status: 2 })
      .then((result) => {
        res.status(200).send({ message: "User deleted", data: result });
      })
      .catch((err) => {
        console.error(err);
        // console.log("Error: ", err);
        res.status(500).send({ message: "user not deleted", error: err });
      });
  } //deleteUser

  // POST /api/login
  // @access Public
  // @desc Login user and return a token
  static async fetchOneUser(req, res) {
    // const { id } = req.params;

    // UserModel.findOne({ _id: id })
    //   .then((result) => {
    //     res.status(200).send({ message: "User details", data: result });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     // console.log("Error: ", err);
    //     res.status(404).send({ message: "user not found", error: err });
    //   });

    const { email, password } = req.body;
    // console.log("email :",email,"password :", password );
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const user = await UserModel.findOne({ email });
        // console.log("User from db", user.email);  // explain nantar
        if (user) {
          if (await compareHash(password, user.password)) {
            const token = createToken({ id: user._id, name: user.name });
            if (user.admin) {
              return res.status(201).send({ token, admin: true });
            } else {
              return res.status(201).send({ token, admin: false });
            }
          } else {
            return res
              .status(401)
              .send({ errors: [{ msg: `Sorry wrong password!!!` }] });
          }
        } else {
          return res
            .status(401)
            .send({ errors: [{ msg: `${email} is not found!` }] });
        }
      } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server internal error!");
      }
    } else {
      //validation failed
      return res.status(401).send({ errors: errors.array() });
    }
  } //fetchOneUser
  static fetchAllUser(req, res) {
    UserModel.find()
      .then((result) => {
        res.status(200).send({ message: "Users List", data: result });
      })
      .catch((err) => {
        console.error(err);
        // console.log("Error: ", err);
        res.status(404).send({ message: "users list not found", error: err });
      });
  } //fetchAllUser
}

module.exports = UserCtrl;
