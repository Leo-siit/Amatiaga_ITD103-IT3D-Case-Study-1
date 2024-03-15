const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,       // User's name
    email: String,      // User's email
    username: String,        // User's age
    password: String,  // User's school ID
    usertype: String,     // User's course
})

// Create a model from the User schema. This model will be used to interact with the 'users' collection in the database
const UserModel = mongoose.model('users', UserSchema)

// Export the UserModel so it can be used in other parts of the application
module.exports = UserModel;