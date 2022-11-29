const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');
var ObjectId = Schema.ObjectId;

const opts = { toJSON: { virtuals: true } };

var CampgroundSchema = new mongoose.Schema({ //first creating schema
    city: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: [
        {
            url: String,
            filename: String
        }
    ],
    description: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type:{
                type: String,
                enum: ['Point'],
            },
        coordinates: {
            type: [Number],
        }
    }
}, opts);

CampgroundSchema.post('findOneAndDelete', async (campground) => { // deleting a farm triggers this middleware, which deletes all its children products 
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
})

CampgroundSchema.virtual('properties.popUpData').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.description}</a>
            <span>, ${this.city}</span> <img src = ${this.image[0].url} style="width:200px; height:150px">`
  });

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;

/* retailerID: {
       type: mongoose.SchemaTypes.ObjectId, 
       //required: true, 
       index: true
   }, */