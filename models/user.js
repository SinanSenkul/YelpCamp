const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    /* campgrounds: [{
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }] */
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;

