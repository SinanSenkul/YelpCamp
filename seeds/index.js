const mongoose = require('mongoose');
var methodOverride = require('method-override');
const { object } = require('webidl-conversions');
const path = require('path');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic2luYW5zZW5rdWwiLCJhIjoiY2xhNzl2eXd4MXRoODNwcGhhMTVpbndkMiJ9.ue-LtK3lIyAB_8rV8q2Mwg' });

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    //useCreateIndex: true, //mongodb says no more supported
    useUnifiedTopology: true
}) //NOTE: you have to run this file on your git terminal
    .then(() => {
        console.log("mongoose connection opened");
    })
    .catch((err) => {
        console.log("error:" + err);
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("db connected");
})

const seedDB = async () => {
    await Campground.deleteMany({});
    //var randomCities50 = new Campground({});
    for (let i = 0; i < 50; i++) {
        let n = Math.round(Math.random() * 1000);
        var city = `${cities[n].city}`;
        var population = `${cities[n].population}`;
        var state = `${cities[n].state}`;
        var camp = new Campground({
            city: city,
            population: population,
            state: state,
            image: [
                {
                    url: 'https://res.cloudinary.com/dl5ogyp0c/image/upload/v1667263407/YelpCamp/od1neaimiouh0xbcpdg5.jpg',
                    filename: 'defaultimage'
                }
            ],
            description: 'Default Campground',
            price: 50,
            author: '6349b43b4784d80444a3adfc',
        })
        var geoData = await geocoder.forwardGeocode({
            query: `${city} ${state}`,
            limit: 1
        }).send();
        camp.geometry = geoData.body.features[0].geometry;
        await camp.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
    .then(() => {
        console.log('mongoose connection closed')
    })