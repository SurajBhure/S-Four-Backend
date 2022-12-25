const { verifyToken } = require('../tokenServices')

//authorize fun takes parameter " roles array " we pass roles array in router middleware authorize
function authorize(roles = []) {
  //middleware has three parameters req,res,next(when next is called it means allow to access the next api)
  return (req, res, next) => {
    const refresh = req.headers.authorization //recieved token from req header (client side req.headers.authorization mdhun token recieved zal)
    // console.log(token);
    //token verification process(by passing that token to verifyToken function it will verify that token and return payload obj)
    const payload = verifyToken(refresh)

    // console.log("Token: ", token);
    // console.log("roles: ", roles);
    // console.log("payload: ", payload);

    //from payload obj _id checked available user or not means access token available(if available _id then token is valid)
    if (payload?._id) {
      //token is valid
      const { role } = payload

      //for roles checking of current user according to that give access permission or not permit to access current api
      if (roles.includes(role)) {
        next()
      } else {
        //no permission to access the current route
        //if role not available in roles array then for that unknown no permission to access current route
        res.status(401).send({
          message: 'You do not have permission to access the api',
          error: null,
        })
      }
    } else {
      // access token expired
      res.status(420).send({
        message: 'Access token expired',
        error: null,
      })
    }
  }
}
module.exports = authorize
