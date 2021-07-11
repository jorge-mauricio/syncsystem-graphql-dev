const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');


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
                return events; //debug test
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    //date: new Date().toISOString()
                    date: args.eventInput.date
                }
                //const eventName = args.name; //same name as the argument defined in the mutation type
                //return eventName;

                events.push(event);
                return event;
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


//Testing server.
/*
app.get('/', (reg, res, next) => {
    res.send('Server working.')
});
*/


app.listen(3000);