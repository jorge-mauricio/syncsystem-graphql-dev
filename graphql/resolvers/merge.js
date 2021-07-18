const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');


const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id, 
        //date: new Date(event._doc.date).toISOString(),
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const transformBooking = booking => {
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
};


const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})  //special mongoose parameter
        //.then(events => {
        return events.map(event => {
            /*
            return { 
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            } 
            */

            //Refactored.
            return transformEvent(event);
        });

        //return events;
        //})
        //.catch();
    } catch (findError) {
        throw findError;
    } finally {
        
    }
}
//async / await - always returns the top promise


const singleEvent = async eventId => {
    try {
        const eventData = await Event.findById(eventId);
        //.then(userData => {
        
        /*return { 
            ...eventData._doc, 
            _id: eventData.id,
            creator: user.bind(this, eventData._doc.creator) 
        };*/


        //Refactored.
        return transformEvent(eventData);

        //})
        //.catch(userReadError => {
            //throw userReadError;
        //});
    } catch (eventReadError) {
        throw eventReadError;
    } finally {
        
    }
};


/*
const user = userId => {
    return User.findById(userId)
    .then(userData => {
        return { 
            ...userData._doc, 
            _id: user.id,
            createdEvents: events.bind(this, userData._doc.createdEvents) 
        }
    })
    .catch(userReadError => {
        throw userReadError;
    });
}
*/

const user = async userId => {
    try {
        const userData = await User.findById(userId);
        //.then(userData => {
        return { 
            ...userData._doc, 
            _id: user.id,
            createdEvents: events.bind(this, userData._doc.createdEvents) 
        };
        //})
        //.catch(userReadError => {
            //throw userReadError;
        //});
    } catch (userReadError) {
        throw userReadError;
    } finally {
        
    }

};


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.dateToString = dateToString;

//exports.events = events;
exports.singleEvent = singleEvent;
exports.user = user;