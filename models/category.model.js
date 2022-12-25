const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } // timestamp will give created time and updated time 
);

categorySchema.plugin(AutoIncrement, { inc_field: "categoryId" });
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
