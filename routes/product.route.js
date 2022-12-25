
const express = require("express");
const router = express.Router();
const { authorized } = require("../helpers/middlewares/Authorization");
const productValidation = require("../validations/productValidation");

const {
  create,
  getProducts,
  fetchProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { catProducts } = require("../controllers/HomeProd.controller");

router.post("/create-product", authorized, create);
router.get("/products/:page", authorized, getProducts);
router.get("/edit-product/:id", authorized, fetchProduct);
router.get("/product/:id", fetchProduct); // public route for get product details
router.put("/product", [authorized, productValidation], updateProduct);
router.delete("/delete/:id", authorized, deleteProduct);
router.get("/cat-products/:name/:page?", catProducts);
router.get("/search-products/:keyword/:page?", catProducts);

module.exports = router;
