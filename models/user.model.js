const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  userId: Number,
  name: {
    first: String,
    last: String,
  },
  mobile: { type: String, minlength: 10, maxlength: 13 },
  email: { type: String, unique: true },
  password: { type: String, minlength: 5, maxlength: 10 },
  avatar: String,
  gender: String,
  age: Number,
  createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(AutoIncrement, { inc_field: "userId" });
module.exports = mongoose.model("User", userSchema);