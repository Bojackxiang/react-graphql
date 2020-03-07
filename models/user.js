const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = new Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    createdEvents: [{ // => 注意，责编是个array
        type: Schema.Types.ObjectId,
        ref: "Event"
    }]
})

module.exports = mongoose.model("User", userModel)