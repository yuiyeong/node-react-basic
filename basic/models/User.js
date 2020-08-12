const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_ROUND = 10

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

userSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_ROUND)
    .then(salt => bcrypt.hash(user.password, salt))
    .then(encrypted => {
      user.password = encrypted
      next()
    })
    .catch(e => next(e))
  } else {
    next()
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
