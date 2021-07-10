const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');


const app = express();

app.use(bodyParser.json());


//GraphQL middleware.
app.use('/graphql', 
    graphqlHTTP({
        //Schema.
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
        }`),
        //Resolver (need to have same names).
        rootValue: {
            //Resolver for reading array of strings.
            events: () => {
                return ['Romantic cooking', 'Sailing', 'All night coding']; //debug test
            },
            createEvent: (args) => {
                const eventName = args.name; //same name as the argument defined in the mutation type
                return eventName;
            }
        },
        //User interface tool
        graphiql: true
        /*
        Debug:
        query {
            events
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