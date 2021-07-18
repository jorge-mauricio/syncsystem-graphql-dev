const bcrypt = require('bcryptjs');

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
};