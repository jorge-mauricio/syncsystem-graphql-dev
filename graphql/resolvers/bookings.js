const Event = require('../../models/event');
const Booking = require('../../models/booking');
//const { dateToString } = require('../../helpers/date');

const { singleEvent, user, transformEvent, transformBooking, dateToString } = require('./merge');


module.exports = {

    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map(booking => {
                /*
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    //createdAt: new Date(booking._doc.createdAt).toISOString(),
                    createdAt: dateToString(booking._doc.createdAt),
                    //updatedAt: new Date(booking._doc.createdAt).toISOString()
                    updatedAt: dateToString(booking._doc.createdAt)
                };
                */

                return transformBooking(booking);
            });

        } catch (dbReadError) {
            throw dbReadError;
        }
    },

    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: '60eb48fcec2df53f74c98508',
            event: fetchedEvent
        });
        const result = await booking.save();
        /*
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            //createdAt: new Date(result._doc.createdAt).toISOString(),
            createdAt: dateToString(result._doc.createdAt),
            
            //updatedAt: new Date(result._doc.createdAt).toISOString()
            updatedAt: dateToString(result._doc.createdAt)
        };
        */
        return transformBooking(result);

    },

    cancelBooking: async args => {
        try {
            //console.log("args=", args);
            const booking = await Booking.findById(args.bookingId).populate('event');
            /*
            const event = { 
                ...booking.event._doc, 
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator) 
            };*/

            //Refactored.
            const event = transformEvent(booking.event);



            //console.log("event=", event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (cancelBookingError) {
            throw cancelBookingError;
        } finally {
            
        }
    }
};
