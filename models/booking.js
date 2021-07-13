const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
},
//Options for the schema
{
    timestamps: true, //automatically add created at and updated at field to the mongoDB collection

});

module.exports = mongoose.model('Booking', bookingSchema);
