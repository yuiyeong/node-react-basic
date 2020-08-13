const { User } = require('../models/User')

const auth = (req, res, next) => {
  let token = req.cookies.x_auth

  User.findByToken(token, (error, user) => {
    if(error) throw error

    if(!user) return res.status(401).json({ isAuth: false, error})

    req.token = token
    req.user = user
    next()
  })
}

module.exports = { auth }