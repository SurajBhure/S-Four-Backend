require("dotenv").config();

// console.log(process.env);
// const PORT = process.env;
module.exports = {
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET_KEY,
};
