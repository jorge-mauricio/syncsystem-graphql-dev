const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Import the mongodb model.
//const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
//const { dateToString } = require('../../helpers/date');


module.exports = {
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
    },

    login: async ({email, password}) => {
        const user = await User.findOne({email: email});

        //Check if user exists.
        if (!user) {
            throw new Error("User does not exist!");
        }

        //Check if password input matches password stored in database.
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            throw new Error("Password is incorrect!");
        }

        //Create token.
        const token = await jwt.sign(
            {
                userId: 
                user.id, 
                email: 
                user.email
            }, 
            'somesupersecretkey', 
            {
                expiresIn: '1h'
            }
        ); //hash token
        return {
            userId: user.id, 
            token: token, 
            tokenExpiration: 1
        }

        //Note: to test authentication, use postman.
            //post
            //body: raw
            //json (application/json)
                //ex: 
                /*
                {
                    "query": "query { login(email: \"jm@jm.com\", password: \"jm123\") { token } }"
                }

                {
                    "query": "mutation { createEvent(eventInput: {title:\"event included authenticated\", description: \"working\", price: 39.99, date: \"2021-07-10T23:39:55.882Z\"}) { _id title } }"
                }
                */
            //To simulate authentication, create key on header:
                //Authorization
                //Bearer(white space)(copy the returned hashed token)
    }
};