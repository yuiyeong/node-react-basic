const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5943


mongoose.connect('', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  
})
.then(() => console.log('connected to mongo db'))
.catch(e => console.error(e))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Server is listening on ${port}`))