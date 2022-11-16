const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
// const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  userId: Number,
  name: {
    first: { type: String, minlength: 3, maxlength: 45 },
    last: { type: String, minlength: 3, maxlength: 45 },
  },
  mobile: { type: String, minlength: 10, maxlength: 13 },
  email: { type: String, minlength: 5, maxlength: 50, required: true },
  password: String,
  role: String,
  avatar: String,
  gender: String,
  age: Number,
  address: {
    street: String,
    city: String,
    country: String,
    pincode: Number,
  },
  createdAt: { type: Date, default: Date.now },
})

userSchema.plugin(AutoIncrement, { inc_field: 'userId' })
const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
