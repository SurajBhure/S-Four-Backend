const UserModel = require('../models/user.model')
const { compareHash } = require('../helpers/encryption')
const { createToken, verifyToken } = require('../helpers/tokenServices')
const UserCtrl = require('./user.controller')

class authCtrl {
  static userLogin(req, res) {
    const { email, password } = req.body

    // console.log("Req.body: ", req.body);

    UserModel.findOne({ email: email, status: 1 })
      .then((result) => {
        // console.log("Result: ", result);

        if (!result) throw new Error('Invalid Email')
        else if (compareHash(password, result.password)) {
          //password matched zala trch tokens generate kryche
          const accessToken = createToken(
            {
              _id: result._id,
              role: result.role,
            },
            60 * 10,
          )
          const refreshToken = createToken(
            {
              _id: result._id,
              role: result.role,
            },
            60 * 10,
          )
          console.log('accessToken: ', accessToken)
          console.log('refreshToken: ', refreshToken)
          res.set('x-access-token', accessToken)
          res.set('x-refresh-token', refreshToken)
          res.status(200).send({
            message: 'login successful',
            data: UserCtrl.pickUser(result),
          })
        } else {
          res.status(404).send({ message: 'Wrong password' })
        }
      })
      .catch((err) => {
        console.log(err)
        res
          .status(400)
          .send({ message: 'Invalid email or user disabled', error: err })
      })
  }

  //token validate krnysathi user login krel tyveles
  static validateToken(req, res) {
    //req header mdhun token get kelay
    const token = req.headers.authorization

    // te token verify kelay
    const payload = verifyToken(token)
    //verify kelyvr tytun payload(data) bhetel tyt id , role asnr

    //payload mdhe _id asel trch pudhe access bhetnr
    if (payload?._id) {
      // token is valid
      const { _id } = payload
      //get the user document from db
      UserModel.findOne({ _id })
        .then((result) => {
          res
            .status(200)
            .send({ data: UserCtrl.pickUser(result), message: 'Valid Token' })
        })
        .catch((err) => {
          console.log(err)
          throw new Error('Invalid token')
        })
    } else {
      // invalid token
      res.status(403).send({ message: 'Invalid Token', error: null })
    }
  } //validateToken

  static refreshToken(req, res) {
    const { refresh } = req.body

    const payload = verifyToken(refresh)

    if (payload?._id) {
      //refresh token is valid create new access and refresh tokens again
      const accessT = createToken(
        { _id: payload?._id, role: payload?.role },
        60 * 10,
      )

      const refreshT = createToken(
        { _id: payload?._id, role: payload?.role },
        60 * 25,
      )

      res.status(200).send({
        data: { accessT, refreshT },
        message: 'tokens created',
      })
    } else {
      //refresh token is invalid
      res.status(403).send({
        message: 'Session Expired',
        error: null,
      })
    }
  } //refreshToken
}

module.exports = authCtrl;

