const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    colors: {
      type: [Map],
    },
    sizes: {
      type: [Map],
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // timestamp will give created time and updated time
);

productSchema.plugin(AutoIncrement, { inc_field: "prodId" });
const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;

