const { validationResult } = require("express-validator");
const CategoryModel = require("../models/category.model");

class CategoryCtrl {
  // Create new category
  static async createCategory(req, res) {
    //validation by express-validators
    const errors = validationResult(req);

    //destructuring name from category model through req.body
    const { name } = req.body;

    if (errors.isEmpty()) {
      const exist = await CategoryModel.findOne({ name });
      if (!exist) {
        await CategoryModel.create({ name });
        return res
          .status(201)
          .send({ message: "Your Category created successfully..." });
      } else {
        return res
          .status(400)
          .send({ errors: [{ msg: `${name} category is already exists` }] });
      }
    } else {
      return res.status(400).send({ errors: errors.array() });
    }
  }

  // Get 3 category on per page
  static async categories(req, res) {
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;

    try {
      const count = await CategoryModel.find({}).countDocuments(); // countDocuments is a inbuilt function
      const categoriesData = await CategoryModel.find({})
        .skip(skip)
        //perpage this skip method we get from mongoose
        .limit(perPage)
        //sort method will call from category.controller through timestamps
        .sort({ updatedAt: -1 });
      console.log(categoriesData);
      return res
        .status(201)
        .send({ categories: categoriesData, perPage, count });
    } catch (error) {
      console.log(error.message);
      return res.status(401).send({ error });
    }
  }

  // Get All categories
  static async allCategories(req, res) {
    try {
      const categories = await CategoryModel.find({});
      return res.status(200).send({ categories });
    } catch (error) {
      return res.status(500).send("Server Interval Error!");
    }
  }

  // Fetch 1 category first
  static async fetchCategory(req, res) {
    const { id } = req.params;
    try {
      const response = await CategoryModel.findOne({ _id: id });
      return res.status(201).send({ category: response });
    } catch (error) {
      console.log(error.message);
      return res.status(401).send({ error });
    }
  }
  // Update fetched on category
  static async updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    //validation by express-validators
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const exist = await CategoryModel.findOne({ name });
      if (!exist) {
        const response = await CategoryModel.updateOne(
          { _id: id },
          { $set: { name } } // set inbuild function to set name which we are receiving from req.body
        );
        return res
          .status(201)
          .send({ message: "Your Category updated  successfully..." });
      } else {
        return res
          .status(400)
          .send({ errors: [{ msg: `${name} category is already exists` }] });
      }
    } else {
      return res.status(400).send({ errors: errors.array() });
    }
  }

  // Delete category
  static async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      await CategoryModel.deleteOne({ _id: id });
      return res
        .status(200)
        .send({ message: "category has been deleted successfully.." });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send({ message: "error to delete category!!!", error });
    }
  }

  static async randomCategories(req, res) {
    try {
      const categories = await CategoryModel.aggregate([
        { $sample: { size: 3 } }, // fetch random 3 category randomly from DB
      ]);
      return res.status(200).send({ categories });
    } catch (error) {
      return res.status(500).send("Server Interval Error !");
    }
  }
}
module.exports = CategoryCtrl;
