const ProductModel = require("../models/product.model");

class HomeProdCtrl {
  static async catProducts(req, res) {
    const { name, page, keyword } = req.params;
    console.log(name, page, keyword);
    const perPage = 12;
    const skip = (page - 1) * perPage;

    const options = name
      ? { category: name }
      : keyword && { title: { $regex: `${keyword}`, $options: "i" } }; // in mongo $regex is a keyword by which we can search and $option:"i" will check the keyword in capital and small alphabet

    if (page) {
      try {
        const count = await ProductModel.find({
          ...options,
        })
          .where("stock")
          .gt(0)
          .countDocuments(); // countDocuments is a inbuilt function
        const productsData = await ProductModel.find({ ...options })
          .where("stock") // this will check the product key value is above 0 or not
          .gt(0) // it will check greater then value
          .skip(skip)
          //perpage this skip method we get from mongoose
          .limit(perPage)
          //sort method will call from category.controller through timestamps
          .sort({ updatedAt: -1 });
        console.log("productsData :->",productsData);
        return res.status(201).send({ products: productsData, perPage, count });
      } catch (error) {
        console.log(error.message);
        return res.status(401).send({ error });
      }
    } else {
      const response = await ProductModel.find({ ...options })
        .where("stock")
        .gt(0)
        .limit(4)
        .sort({ updatedAt: -1 });

      return res.status(201).send({ products: response });
    }
  }
}

module.exports = HomeProdCtrl;
