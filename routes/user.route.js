const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { createUserValidations,loginValidations } = require("../validations/userValidations");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "avatar") cb(null, "uploads/user-avatar");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const {
  createUser,
  // updateUser,
  deleteUser,
  fetchOneUser,
  fetchAllUser,
} = require("../controllers/user.controller");

router.post("/register", createUserValidations, createUser); // to register a user || createuser
// router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login",loginValidations, fetchOneUser); // login user || fetchone user
router.get("/", fetchAllUser);

module.exports = router;
