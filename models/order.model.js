const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: Number,

  //ithe mongoose la klnr ahe ki ha customerid konala relate krycha ani konta data fetch krycha
  //ithe apn jo id store krnr to same id customer collection mdhe bghitla jail ani te particular ekch document dil jail
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
      price: Number,
      quantity: Number,
      color: String,
      size: String,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    country: String,
    pincode: Number,
  },
  paidAmount: { type: Number, default: 0 },
  paymentMode: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("Order", orderSchema);
