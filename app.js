const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Import the mongodb model.
const Event = require('./models/event')
const User = require('./models/user')

const app = express();

//debug test (store in memory).
const events = []; //debug test

app.use(bodyParser.json());


//GraphQL middleware.
app.use('/graphql', 
    graphqlHTTP({
        //Schema.
        /*
        schema: buildSchema(`
            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                createEvent(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }`
        ),
        */
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!
                email: String!
                password: String
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }`
        ),
        //Resolver (need to have same names).
        rootValue: {
            //Resolver for reading array of strings.
            events: () => {
                //return ['Romantic cooking', 'Sailing', 'All night coding']; //debug test
                //return events; //debug test

                return Event.find()
                .then(dbReadResults => {
                    return dbReadResults.map(event =>{
                        //return { ...event._doc };
                        //return { ...event._doc, _id: event._doc._id.toString() }; //transform id (mongodb object) to string readable in api
                        return { ...event._doc, _id: event.id }; //virtual getter provided by mongoose
                    });
                }).catch(dbReadError =>{
                    throw dbReadError;
                });
            },
            createEvent: (args) => {
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


                //const eventName = args.name; //same name as the argument defined in the mutation type
                //return eventName;

                //events.push(event);
                //return event;


                //Save to database.
                return event
                .save()
                .then(dbWriteResult => {
                    createdEvent = { ...dbWriteResult._doc, _id: dbWriteResult._doc._id.toString() };
                    return User.findById('60eb48fcec2df53f74c98508'); //debug test
                    //console.log("dbWriteResult=", dbWriteResult);
                    //return {...dbWriteResult._doc};
                    //return {...dbWriteResult._doc, _id: dbWriteResult._doc._id.toString()};
                })
                .then(userFindDB => {
                    if(!userFindDB)
                    {
                        throw new Error('User doen´t exist.');
                    }

                    userFindDB.createdEvents.push(event); //mongoose feature
                    return userFindDB.save(); //update existing user 

                })
                .then(updateResult => {
                    return createdEvent;
                })
                .catch(dbWriteError => {
                    console.log("dbWriteError=", dbWriteError);
                    throw dbWriteError;
                });
                //return event;
            },
            createUser: args => {
                return User.findOne({email: args.userInput.email}).then(userFromDB => {
                    if(userFromDB) { //user found
                        throw new Error ('user exists already.');
                    }

                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    //Create user
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(saveResult => {
                    //return {...saveResult._doc, _id: saveResult.id };
                    return {...saveResult._doc, password: null, _id: saveResult.id }; //don´t retrieve password (overwrite password)
                })
                .catch(hashError => {
                    throw hashError;
                });
            }
        },
        //User interface tool
        graphiql: true
        /*
        Debug:
        query {
            events
        }

        mutation {
            createEvent(name: "Sports")
        }


        query{
            events {
                title
                price
            }
        }  
        
        mutation {
            createEvent(eventInput: {
                title: "A test",
                description: "some description",
                price: 9.99,
                date: "2021-07-10T23:39:55.882Z"
            }){
                title
                description    
            }
        }


        mutation {
            createUser(userInput: {
                email: "jm4@jm.com",
                password: "jm123",
            }){
                email
                password    
            }
        }
        */
    })
);



//Mongo DB test connection:
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@syncsystem-graphql-dev.apy3s.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
).then(()=>{
    //Start server.
    app.listen(3000);
}).catch(dbConError => {
    console.log("dbConError=", dbConError);
});


//Testing server.
/*
app.get('/', (reg, res, next) => {
    res.send('Server working.')
});
*/
//app.listen(3000);