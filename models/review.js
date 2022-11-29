const mongoose = require('mongoose');
var {Schema} = mongoose;
var ObjectId = Schema.ObjectId;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    campground: {
        type: Schema.Types.ObjectId, 
        ref: 'Campground'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //authorname: String
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;