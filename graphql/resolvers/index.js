const bcrypt = require('bcryptjs');

//Import the mongodb model.
const Event = require('../../models/event')
const User = require('../../models/user')

/*
const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})  //special mongoose parameter
    .then(events => {
        return events.map(event => {
            return { ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            } 
        });
    })
    .catch();
}
*/


const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})  //special mongoose parameter
        //.then(events => {
        events.map(event => {
            return { ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            } 
        });

        return events;
        //})
        //.catch();
    } catch (findError) {
        throw findError;
    } finally {
        
    }
}
//async / await - always returns the top promise

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

}



module.exports = {
    //Resolver for reading array of strings.
    events: async () => {
        //return ['Romantic cooking', 'Sailing', 'All night coding']; //debug test
        //return events; //debug test

        const dbReadResults = await Event.find();
        try {
        //substituted with userId function .populate('creator')//mongoose method - get information by ref
        //.then(dbReadResults => {
            return dbReadResults.map(event =>{
                //return { ...event._doc };
                //return { ...event._doc, _id: event._doc._id.toString() }; //transform id (mongodb object) to string readable in api
                return { 
                    ...event._doc, 
                    date: new Date(event._doc.date).toISOString(),
                    _id: event.id,

                    //overwrite some information about the creator linked to the event
                    /*
                    creator: {
                        ...event._doc.creator._doc,
                        _id: event._doc.creator.id
                    }
                    */
                    creator: user.bind(this, event._doc.creator) //point to the user function


                }; //virtual getter provided by mongoose
            });
        //}).catch(dbReadError =>{
        //    throw dbReadError;
        //});
        } catch (dbReadError) {
            throw dbReadError;
        } finally {
            
        }
        
    },
    createEvent: async (args) => {
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     //date: new Date().toISOString()
        //     date: args.eventInput.date
        // }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '60eb48fcec2df53f74c98508' //debug test
        });
        let createdEvent;
        try {
            //const eventName = args.name; //same name as the argument defined in the mutation type
            //return eventName;

            //events.push(event);
            //return event;


            //Save to database.
            const dbWriteResult = await event
            .save()
            //.then(dbWriteResult => {
                //createdEvent = { ...dbWriteResult._doc, _id: dbWriteResult._doc._id.toString() };
                createdEvent = { ...dbWriteResult._doc, 
                    _id: dbWriteResult._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, dbWriteResult._doc.creator)
                };
                const userFindDB = await User.findById('60eb48fcec2df53f74c98508'); //debug test
                //console.log("dbWriteResult=", dbWriteResult);
                //return {...dbWriteResult._doc};
                //return {...dbWriteResult._doc, _id: dbWriteResult._doc._id.toString()};
            //})
            //.then(userFindDB => {
                if(!userFindDB)
                {
                    throw new Error('User doen´t exist.');
                }

                userFindDB.createdEvents.push(event); //mongoose feature
                await userFindDB.save(); //update existing user 

            //})
            //.then(updateResult => {
                return createdEvent;
            //})
            //.catch(dbWriteError => {
            //    console.log("dbWriteError=", dbWriteError);
            //   throw dbWriteError;
            //});
            //return event;

        } catch (dbWriteError) {
            throw dbWriteError;
        } finally {
            
        }
    },
    createUser: async args => {
        try {
        const userFromDB = await User.findOne({email: args.userInput.email});
        //.then(userFromDB => {
            if(userFromDB) { //user found
                throw new Error ('user exists already.');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        //})
        //.then(hashedPassword => {
            //Create user
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const saveResult = await user.save();
        //})
        //.then(saveResult => {
            //return {...saveResult._doc, _id: saveResult.id };
            return {...saveResult._doc, password: null, _id: saveResult.id }; //don´t retrieve password (overwrite password)
        //})
        //.catch(hashError => {
        //    throw hashError;
        //});
        } catch (hashError) {
            throw hashError;
        } finally {
            
        }
    }
}