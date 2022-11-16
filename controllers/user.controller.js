const {
  encryption,
  // compareHash,
  // hashedPassword,
} = require('../helpers/encryption')
const UserModel = require('../models/user.model')
const _ = require('lodash')
// const { validationResult } = require('express-validator')
// const { createToken } = require('../helpers/tokenServices')

class UserCtrl {
  static pickUser(user) {
    return _.pick(user, [
      '_id',
      'userId',
      'name',
      'mobile',
      'email',
      'gender',
      'age',
      'role',
      'avatar',
      'createdAt',
      'address',
    ])
  }

  static createUser(req, res) {
    const user = req.body // const { name, mobile, email, password } = req.body;

    console.log('Req.body User: ', user) //req.body checking
    console.log('req-file: ', req.file) //req.file checking

    // if req contains password then encrpt it
    if (user.password) user.password = encryption(user.password)

    console.log('encrypted password: ', user.password)

    if (req.file) user.avatar = req?.file?.filename

    new UserModel(user)
      .save()
      .then((result) => {
        res.status(201).send({
          message: 'User created',
          data: UserCtrl.pickUser(result),
        })
      })
      .catch((err) => {
        console.error(err)
        // console.log('Error: ', err)
        res.status(500).send({ message: 'user not created', error: err })
      })
  }
  //createUser

  static updateUser(req, res) {
    const { id } = req.params
    const user = req.body

    console.log('User: ', user)
    // if req contains password then encrpt it
    if (user.password) user.password = encryption(user.password)

    if (req.file) user.avatar = req?.file?.filename
    // console.log('User: ', user)

    UserModel.findOneAndUpdate({ _id: id }, user, { new: true })
      .then((result) => {
        res
          .status(200)
          .send({ message: 'User updated', data: UserCtrl.pickUser(result) })
      })
      .catch((err) => {
        console.error(err)
        // console.log("Error: ", err);
        res.status(500).send({ message: 'user not updated', error: err })
      })
  } //updateUser

  static deleteUser(req, res) {
    const { id } = req.params

    UserModel.findOneAndDelete({ _id: id })
      .then((result) => {
        res
          .status(200)
          .send({ message: 'User deleted', data: UserCtrl.pickUser(result) })
      })
      .catch((err) => {
        console.error(err)
        // console.log("Error: ", err);
        res.status(500).send({ message: 'user not deleted', error: err })
      })
  } //deleteUser

  // POST /api/login
  // @access Public
  // @desc Login user and return a token
  static fetchOneUser(req, res) {
    const { id } = req.params

    UserModel.findOne({ _id: id })
      .then((result) => {
        res
          .status(200)
          .send({ message: 'User details', data: UserCtrl.pickUser(result) })
      })
      .catch((err) => {
        console.error(err)
        // console.log("Error: ", err);
        res.status(404).send({ message: 'User not found', error: err })
      })

    // const { email, password } = req.body
    // // console.log("email :",email,"password :", password );
    // const errors = validationResult(req)
    // if (errors.isEmpty()) {
    //   try {
    //     const user = await UserModel.findOne({ email })
    //     // console.log("User from db", user.email);  // explain nantar
    //     if (user) {
    //       if (compareHash(password, user.password)) {
    //         const token = createToken({ id: user._id, name: user.name })
    //         if (user.admin) {
    //           return res.status(201).send({ token, admin: true })
    //         } else {
    //           return res.status(400).send({ token, admin: false })
    //         }
    //       } else {
    //         return res
    //           .status(401)
    //           .send({ errors: [{ msg: `Sorry wrong password!!!` }] })
    //       }
    //     } else {
    //       return res
    //         .status(401)
    //         .send({ errors: [{ msg: `${email} is not found!` }] })
    //     }
    //   } catch (error) {
    //     console.log(error.message)
    //     return res.status(500).send('Server internal error!')
    //   }
    // } else {
    //   //validation failed
    //   return res.status(401).send({ errors: errors.array() })
    // }
  } //fetchOneUser

  static fetchAllUser(req, res) {
    const filter = { $or: [{ status: 0 }, { status: 1 }] }
    UserModel.find(filter)
      .then((result) => {
        res.status(200).send({
          message: 'Users List',
          data: _.map(result, (user) => UserCtrl.pickUser(user)),
        })
      })
      .catch((err) => {
        console.error(err)
        // console.log("Error: ", err);
        res.status(404).send({ message: 'users not found', error: err })
      })
  } //fetchAllUser
}

module.exports = UserCtrl
