const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  userId: Number,
  name: {
    type: String,
    required: true,
  },
  mobile: { type: String, minlength: 10, maxlength: 13 },
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 5, required: true },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: String,
  gender: String,
  age: Number,
  createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(AutoIncrement, { inc_field: "userId" });
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
