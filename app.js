const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
//const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

const cors = require('cors')

//Import the mongodb model.
//const Event = require('./models/event')
//const User = require('./models/user')

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();




//debug test (store in memory).
//const events = []; //debug test

app.use(bodyParser.json());

//Add headers for CORS.
/*
app.use((req, res, next) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.header('Access-Control-Allow-Headers', 'content-type');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
    
    //if (req.method === 'OPTIONS') {
    //    return res.sendStatus(200);
    //}
    next();
});
*///didn´t work - research further
app.use(cors());


// Add headers
/*
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/
/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();
});
*/
app.use(isAuth); //define middleware



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
                _id
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

        query{
            bookings {
                createdAt
              	event {
                    title
                    creator {
                        email
                    }
                  }
                }
            }
  
        query{
            login(email: "jm@jm.com", password: "123") {
                userId
                token
                tokenExpiration
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

        mutation {
            bookEvent(eventId: "60eb8b7e8137eb5f6c405b46"){
            _id
            user{
              email
            }
          }
        }        

        mutation {
            cancelBooking(bookingId: "60eb94b159223d5f34271aaa") {
                title
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
    app.listen(3001);
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