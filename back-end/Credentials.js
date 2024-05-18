const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Ensure that a name is provided for each credential
    },
    fee: {
        type: Number,
        required: true // Ensure that a fee is provided for each credential
    },
    description: {
        type: String,
        required: true // Ensure that a description is provided for each credential
    }
});

// Create a model from the Credential schema. This model will be used to interact with the 'credentials' collection in the database
const CredentialModel = mongoose.model('credentials', CredentialSchema);

// Export the CredentialModel so it can be used in other parts of the application
module.exports = CredentialModel;
