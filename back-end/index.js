const express = require('express')
const mongoose = require('mongoose')
const UserModel = require('./User')

const app = express()
const port = 3000

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/credentialDB',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(db => console.log('DB is connected')) // Log success message
.catch(err => console.log(err)); // Log error message

app.get('/', (req, res) => {
    UserModel.find() // Find all users
      .then(users => res.json(users)) // Send users as response
      .catch(err => res.json(err)) // Send error as response
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})