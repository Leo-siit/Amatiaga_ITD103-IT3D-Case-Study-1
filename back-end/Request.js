const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true // Ensure that a user is associated with each request
    },
    credentials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'credentials', // Reference to the Credential model
        required: true // Ensure that at least one credential is requested
    }],
    total_pay: {
        type: Number,
        required: true // Ensure that the total payment amount is provided
    },
    approved: {
        type: Boolean,
        default: false // Default value is false, indicating pending approval
    },
    date_requested: {
        type: Date,
        default: Date.now // Set default value to current date and time
    },
    date_approved: {
        type: Date,
        default: null // Initially set to null until approved
    },
    claim_on: {
        type: Date,
        default: null // Initially set to null until claimed
    },
    claimed: {
        type: Boolean,
        default: false // Default value is false, indicating unclaimed
    },
    date_claimed: {
        type: Date,
        default: null // Initially set to null until claimed
    }
});

// Create a model from the Request schema. This model will be used to interact with the 'requests' collection in the database
const RequestModel = mongoose.model('request', RequestSchema);

// Export the RequestModel so it can be used in other parts of the application
module.exports = RequestModel;
