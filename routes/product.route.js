const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
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
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
} = require("../controllers/product.controller");

router.post(
  "/",
  //for multiple images array used and 10 is used for maximum 10 images allowed
  upload.array("images", 10),
  createProduct
);

router.put("/:id", upload.array("images", 10), updateProduct);

router.delete("/:id", deleteProduct);

router.get("/:id", getSingleProduct);

router.get("/", getAllProduct);

module.exports = router;
