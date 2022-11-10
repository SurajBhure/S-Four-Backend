const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/envConfig");


module.exports.createToken = (user)=>{
    return jwt.sign(
        user,
        JWT_SECRET,{expiresIn:'7d'}
      );
} 