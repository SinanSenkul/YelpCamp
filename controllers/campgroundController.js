const express = require('express');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const { findById } = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
var GeoJSON = require('geojson');

module.exports.newCampgroundGet = async (req, res, next) => {
    var title = 'New Campground';
    res.render('campgrounds/new', { title });
};

module.exports.index = async (req, res) => {
    var allCampgrounds = await Campground.find({}).populate('image');
    var title = 'Home';
    res.render('campgrounds/index', { allCampgrounds, title});
}

module.exports.newCampgroundPost = async (req, res) => {
    var geoData = await geocoder.forwardGeocode({
        query: `${req.body.campground.city} ${req.body.campground.state}`,
        limit: 1
    }).send();
    var campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'New Campground Successfully Added');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.showCampground = async (req, res) => { // handlers using id has to be arranged at below, otherwise we get id cast error
    var { id } = req.params;
    var campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'No Campground Was Found');
        res.redirect('/campgrounds');
    }
    else {
        var title = campground.description;
        var reviews = campground.reviews;
        var lng = campground.geometry.coordinates[0];
        var lat = campground.geometry.coordinates[1];
        res.render('campgrounds/show', { campground, id, title, reviews, lat, lng });
    }
}

module.exports.editCampgroundGet = async (req, res) => {
    var { id } = req.params;
    var editCampground = await Campground.findById(id);
    var title = editCampground.city;
    return res.render('campgrounds/edit', { editCampground, title });
}

module.exports.editCampgroundPatch = async (req, res) => { //UPDATE - PATCH
    var { id } = req.params;
    var campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true }); //, 
    var extraImage = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.image.push(...extraImage);
    const removeImageList = req.body.check;
    if (typeof removeImageList === "string") {
        cloudinary.uploader.destroy(removeImageList);
        await Campground.updateMany(
            {},
            { $pull: { image: { filename: removeImageList } } }
        )
    }
    else if (typeof removeImageList === "object") {
        for (var i = 0; i < removeImageList.length; i++) {
            cloudinary.uploader.destroy(removeImageList[i]);
            await Campground.updateMany(
                {},
                { $pull: { image: { filename: removeImageList[i] } } }
            )
        }
    }
    var geoData = await geocoder.forwardGeocode({
        query: `${req.body.campground.city} ${req.body.campground.state}`,
        limit: 1
    }).send();
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success', 'New Campground Successfully Updated');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    var { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Successfully Deleted');
    res.redirect('/campgrounds');
}