
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs"); //works with the file system
const path = require("path");
const ProductModel = require("../models/product.model");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

class productCtrl {
  static async create(req, res) {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (!err) {
        // console.log("field :", fields); // check both fields and files are coming or not here from formData append
        // console.log("files :", files)

        // we have recived fields data as jsonstring format so we have to parse this data
        const parsedData = JSON.parse(fields.data);
        // console.log(parsedData);

        const errors = [];
        // for product validation we will do manually bcoz express valudation is not working here

        if (parsedData.title.trim().length === 0) {
          // for title validation
          errors.push({ msg: "title is required" });
        }
        if (parseInt(parsedData.price) < 1) {
          // for price validation but we are getting price as string format so we have to change it to number first
          errors.push({ msg: "price should be above Rs 1" });
        }
        if (parseInt(parsedData.discount) < 0) {
          // for discount validation but we are getting price as string format so we have to change it to number first
          errors.push({ msg: "discount should not be negative" });
        }
        if (parseInt(parsedData.stock) < 20) {
          // for stock validation but we are getting price as string format so we have to change it to number first
          errors.push({ msg: "stock should not be negative" });
        }
        if (fields.description.trim().length === 0) {
          // for description validation
          errors.push({ msg: "description is required" });
        }

        if (errors.length === 0) {
          //   console.log("files:->", files); // check we are getting image files if getting then we also validate this here
          if (!files["image1"]) {
            errors.push({ msg: "image1 is required" });
          }
          if (!files["image2"]) {
            errors.push({ msg: "image2 is required" });
          }
          if (!files["image3"]) {
            errors.push({ msg: "image3 is required" });
          }
          if (errors.length === 0) {
            const images = {}; //make object for images
            for (let i = 0; i < Object.keys(files).length; i++) {
              const mimeType = files[`image${i + 1}`].mimetype; // image1 //imag2 //image3
              //   console.log("mimetype", mimeType); // output : mimetype image/png
              const extension = mimeType.split("/")[1].toLowerCase();
              // console.log(extension); // check extension of the image

              if (
                extension === "jpeg" ||
                extension === "jpg" ||
                extension === "png"
              ) {
                // console.log("fine"); // check the loop working after uplaod all working extension images
                const imageName = uuidv4() + `.${extension}`; // for diffrent image name we use uuid

                const __dirname = path.resolve(); //check the directory
                // console.log(__dirname);
                const newPath =
                  __dirname + `/../s-four_frontend/public/images/${imageName}`;

                images[`image${i + 1}`] = imageName; // image name assign

                fs.copyFile(files[`image${i + 1}`].filepath, newPath, (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
              } else {
                const error = {};
                error[`msg`] = `image${i + 1} has invalid ${extension} type`;
                errors.push(error);
              }
            }
            if (errors.length === 0) {
              // console.log("All images :->",images); // check images name is display here
              try {
                const response = await ProductModel.create({
                  title: parsedData.title,
                  price: parseInt(parsedData.price),
                  discount: parseInt(parsedData.discount),
                  stock: parseInt(parsedData.stock),
                  category: parsedData.category,
                  colors: parsedData.colors,
                  sizes: JSON.parse(fields.sizes),
                  image1: images[`image1`],
                  image2: images[`image2`],
                  image3: images[`image3`],
                  description: fields.description,
                });
                return res
                  .status(201)
                  .send({ message: " Product created successful", response });
              } catch (error) {
                console.log(error);
                return res.status(500).send({ error });
              }
            } else {
              return res.status(400).send({ errors });
            }
          } else {
            return res.status(400).send({ errors });
          }
        } else {
          return res.status(400).send({ errors });
        }
      }
    });
  }
  static async getProducts(req, res) {
    const page = req.params.page;
    const perPage = 5;
    const skip = (page - 1) * perPage;

    try {
      const count = await ProductModel.find({}).countDocuments(); // countDocuments is a inbuilt function
      const productsData = await ProductModel.find({})
        .skip(skip)
        //perpage this skip method we get from mongoose
        .limit(perPage)
        //sort method will call from category.controller through timestamps
        .sort({ updatedAt: -1 });
      //   console.log(productsData);
      return res.status(201).send({ products: productsData, perPage, count });
    } catch (error) {
      console.log(error.message);
      return res.status(401).send({ error });
    }
  }
  static async fetchProduct(req, res) {
    const { id } = req.params;
    // console.log(id);
    try {
      const product = await ProductModel.findOne({ _id: id });
      return res.status(200).send(product);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    // console.log(req.body);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      //   console.log("Working Fine");  try to remove some fields and check wheter the validation is working fine or not

      try {
        const {
          _id,
          title,
          price,
          discount,
          stock,
          category,
          colors,
          sizes,
          description,
        } = req.body;

        const response = await ProductModel.updateOne(
          { _id },
          {
            $set: {
              title,
              price,
              discount,
              stock,
              category,
              colors,
              sizes,
              description,
            },
          }
        );
        return res
          .status(200)
          .send({ message: "Your product updated...", response });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: "Internal Server Error", error });
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    // console.log(id);

    try {
      const product = await ProductModel.findOne({ _id: id });
      //   console.log(product);
      [1, 2, 3].forEach((number) => {
        // All valriables should be in let bcoz we are using loop and on every loop the status will be change

        // for images we have to run loop 3 times
        let key = `image${number}`;
        let image = product[key]; // we are checking objet key name of image1,image2,image3 in product object
        let __dirname = path.resolve(); //check the directory
        // console.log(__dirname);
        let imagePath =
          __dirname + `/../s-four_frontend/public/images/${image}`;

        fs.unlink(imagePath, (err) => {
          if (err) {
            throw new Error(err);
          }
        });
      });
      await ProductModel.findByIdAndDelete(id);
      return res
        .status(201)
        .send({ message: "Product has been deleted successfully!!" });
    } catch (error) {
      throw new Error(error.message);
    }
    console.log("delete");
  }
}

module.exports = productCtrl;
