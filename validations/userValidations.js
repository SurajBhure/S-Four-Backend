const { body } = require("express-validator");

module.exports.createUserValidations = [
  body("name")
    .not()
    .isEmpty() // input filed should not empty
    .trim()     //   "     suraj    "
    .escape()  // "suraj,>@"
    .withMessage("Name is required"),
 //    @GMAIL.COM
  body("email").isEmail().normalizeEmail().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

module.exports.loginValidations = [
  body("email").isEmail().normalizeEmail().trim().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];
