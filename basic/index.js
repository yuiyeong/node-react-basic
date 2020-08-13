const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

const app = express()
const port = 3000

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// application/json
app.use(bodyParser.json())

app.use(cookieParser())

mongoose.connect(config.MONGO_DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log('connected to mongo db'))
.catch(e => console.error(e))



app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, doc) => {
    if(err) return res.status(400).json({ success: false, err})

    return res.status(200).json({ success: true })
  })
})


app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(404).json({ success: false, err })

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return res.status(400).json({ success:false, err })

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        res.cookie("x_auth", user.token).status(200).json({ success: true, })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  const {  _id, role, email, name } = req.user
  res.status(200).json({
    _id,
    isAdmin: role === 0 ? false : true,
    email,
    name
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    {_id: req.user._id}, 
    {token: ''}, 
    (err, _) => {
      if ( err ) return res.status(400).json({ success: false, err })

      return res.json({ success: true })
    })
})

app.listen(port, () => console.log(`Server is listening on ${port}`))