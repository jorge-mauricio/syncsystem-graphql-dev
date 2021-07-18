const Event = require('../../models/event');

//const { dateToString } = require('../../helpers/date');
//const { events, singleEvent, user } = require('./merge');
const { user, transformEvent, dateToString } = require('./merge');


module.exports = {
    //Resolver for reading array of strings.
    events: async () => {
        //return ['Romantic cooking', 'Sailing', 'All night coding']; //debug test
        //return events; //debug test

        const dbReadResults = await Event.find();
        try {
        //substituted with userId function .populate('creator')//mongoose method - get information by ref
        //.then(dbReadResults => {
            return dbReadResults.map(event => {
                //return { ...event._doc };
                //return { ...event._doc, _id: event._doc._id.toString() }; //transform id (mongodb object) to string readable in api
                
                /*
                return { 
                    ...event._doc, 
                    date: new Date(event._doc.date).toISOString(),
                    _id: event.id,

                    //overwrite some information about the creator linked to the event
                    //creator: {
                    //    ...event._doc.creator._doc,
                    //    _id: event._doc.creator.id
                    //}
                    creator: user.bind(this, event._doc.creator) //point to the user function


                }; //virtual getter provided by mongoose
                */

                //Refactored.
                return transformEvent(event);

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
            const dbWriteResult = await event.save()
            //.then(dbWriteResult => {
                //createdEvent = { ...dbWriteResult._doc, _id: dbWriteResult._doc._id.toString() };
                /*
                createdEvent = { ...dbWriteResult._doc, 
                    _id: dbWriteResult._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, dbWriteResult._doc.creator)
                };
                */

                //Refactored.
                createdEvent = transformEvent(dbWriteResult);

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
    }
};
