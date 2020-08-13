const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

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

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, callback)
}

userSchema.methods.generateToken = function (callback) {
  let user = this
  let token = jwt.sign(user._id.toHexString(), config.TOKEN_SECRET_KEY)
  user.token = token
  user.save((error, user) => {
    if ( error ) return callback(error)
    
    callback(null, user)
  })
}

userSchema.statics.findByToken = function (token, callback) {
  let user = this
  jwt.verify(token, config.TOKEN_SECRET_KEY, (err, decoded) => {
    user.findOne({ "_id": decoded, "token": token }, callback)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
