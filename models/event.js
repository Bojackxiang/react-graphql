const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String, 
        required: true,
    }, 
    description: {
        type: String,
        required: true, 
    },
    price: {
        type: Number, 
        required: true
    },
    date: {
        type: Date, 
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User' // => this has to be matched with ref's mongoose.model("{name}") (这个地方的名称要和对应的表的名字相同)
    }
})

module.exports = mongoose.model("Event", eventSchema);