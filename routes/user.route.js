const router = require('express').Router()
const multer = require('multer')
const path = require('path')
// const { createUserValidations } = require('../validations/userValidations')
const { validateUser } = require('../validations/user.validation')
// const authorize = require('../helpers/middlewares/authorize')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == 'avatar') cb(null, 'uploads/user-avatar')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    )
  },
})

const upload = multer({ storage: storage })

const {
  createUser,
  updateUser,
  deleteUser,
  fetchOneUser,
  fetchAllUser,
} = require('../controllers/user.controller')
const authorize = require('../helpers/middlewares/authorize')

router.post('/', upload.single('avatar'), validateUser, createUser) // to register a user || createuser

router.put(
  '/:id',
  upload.single('avatar'),
  // authorize(['superadmin', 'admin', 'customer']),
  validateUser,
  updateUser,
)

router.delete(
  '/:id',
  //  authorize(['superadmin', 'admin']),
  deleteUser,
)

router.get(
  '/:id',
  //  authorize(['superadmin', 'admin', 'customer']),
  fetchOneUser,
) // login user || fetchone user

router.get(
  '/',
  //  authorize(['superadmin', 'admin']),
  fetchAllUser,
)

module.exports = router
