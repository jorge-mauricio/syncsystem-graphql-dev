const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
//const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

//Import the mongodb model.
//const Event = require('./models/event')
//const User = require('./models/user')

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')

const app = express();




//debug test (store in memory).
//const events = []; //debug test

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
        schema: graphQLSchema,
        //Resolver (need to have same names).
        rootValue: graphQLResolvers,
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

        query{
            events {
              	_id
                title
                price
              	creator	{
                  _id
                  email
                  createdEvents {
                    title
                  }
                }
            }
        }  //returns error after restructure


        query{
            events {

                title
                price
              	creator	{

                  email
                  createdEvents {
                    title
                  }
                }
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


        mutation {
            createEvent(eventInput: {
                title: "More events changed after optimization",
                description: "some description",
                price: 9.99,
                date: "2021-07-10T23:39:55.882Z"
            }){
                title
                description  
            		creator {
                  email
                }
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