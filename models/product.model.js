const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  prodId: Number,
  name: {
    type: String,
    required: true,
  },
  category: String,
  price: Number,
  rating: Number,
  status: Number,
  stock: Number,
  color: String,
  images: [],
  orders: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

productSchema.plugin(AutoIncrement, { inc_field: "prodId" });
const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
