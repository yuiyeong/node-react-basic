const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const app = express()
const port = 3000

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// application/json
app.use(bodyParser.json())

mongoose.connect('', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  
})
.then(() => console.log('connected to mongo db'))
.catch(e => console.error(e))



app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, doc) => {
    if(err) return res.status(400).json({ success: false, err})
    
    return res.status(200).json({ success: true })
  })
})








app.listen(port, () => console.log(`Server is listening on ${port}`))