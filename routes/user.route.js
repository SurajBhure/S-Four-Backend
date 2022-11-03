const router = require("express").Router();

const {
  createUser,
  updateUser,
  deleteUser,
  fetchOneUser,
  fetchAllUser,
} = require("../controllers/user.controller");

router.post("/", createUser);

module.exports = router;