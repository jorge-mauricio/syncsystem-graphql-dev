const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create a schema for event model.
const eventSchema = new Schema({
    //Define types detailed.
    title: {
        type: String,
        required: true //non-nullable
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});


//Model.
module.exports = mongoose.model('Event', eventSchema);
