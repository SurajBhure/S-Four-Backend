const express = require("express");
const router = express.Router();
const categoryValidations = require("../validations/categoryValidations");
const { authorized } = require("../helpers/middlewares/Authorization");
const {
  createCategory,
  categories,
  allCategories,
  fetchCategory,
  updateCategory,
  deleteCategory,
  randomCategories,
} = require("../controllers/category.controller");

router.post(
  "/create-category",
  [categoryValidations, authorized],
  createCategory
); // create new category
router.get("/categories/:page", authorized, categories); // get 3 category per page
router.get("/fetch-category/:id", authorized, fetchCategory); // fetch single category
router.put(
  "/update-category/:id",
  [categoryValidations, authorized],
  updateCategory
); // update single category
router.delete("/delete-category/:id", authorized, deleteCategory); // update single category
router.get("/allcategories", allCategories); // get all categories
router.get("/random-categories", randomCategories); // get random categories

module.exports = router;
