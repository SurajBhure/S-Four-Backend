const bcrypt = require("bcryptjs");

const encryption = (text)=>{
    try {
        return bcrypt.hashSync(text,10);
    } catch (error) {
        console.error(error);
    }
}

const compareHash = async (password,dbPassword)=>{
    try {
        return bcrypt.compareSync(password,dbPassword)
    } catch (error) {
        console.error(error);
    }
}

module.exports = {encryption,compareHash}

// module.exports.hashedPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   const hashed = await bcrypt.hash(password, salt);
//   return hashed;
// };
