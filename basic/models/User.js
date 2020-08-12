const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 50, trim:true },
  email: { type: String, trim:true , unique: 1 },
  password: { type: String, minlength: 8 },
  lastname: { type: String, maxlength: 50, trim:true },
  role: { type: Number, default: 0 },
  image: String,
  token: String,
  tokenExpiredAt: Number
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
