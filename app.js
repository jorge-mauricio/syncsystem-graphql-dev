const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

//Import the mongodb model.
const Event = require('./models/event')

const app = express();

//debug test (store in memory).
const events = [];

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

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
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
                })


                //const eventName = args.name; //same name as the argument defined in the mutation type
                //return eventName;

                //events.push(event);
                //return event;


                //Sabe to database.
                return event
                .save()
                .then(dbWriteResult => {
                    console.log("dbWriteResult=", dbWriteResult);
                    return {...dbWriteResult._doc};
                }).catch(dbWriteError => {
                    console.log("dbWriteError=", dbWriteError);
                    throw dbWriteError;
                });
                //return event;
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