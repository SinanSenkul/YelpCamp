//OLD CODE STACK
/* const validateCampground = (req, res, next) => {
    var { error } = campgroundSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    var { error } = reviewSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.get('/campgrounds/new', catchAsync(async (req, res, next) => {
    var title = 'New Campground';
    res.render('campgrounds/new', { title });
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    var campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
}));

app.post('/campgrounds/:id/review', validateReview, catchAsync(async (req, res) => {
    var { id } = req.params;
    var review = new Review(req.body.review);
    await review.save();
    var campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id/review/:reviewId', catchAsync(async (req, res) => {
    var { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.get('/campgrounds', catchAsync(async (req, res) => {
    var allCampgrounds = await Campground.find({});
    var title = 'Home';
    res.render('campgrounds/index', { allCampgrounds, title });
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => { // handlers using id has to be arranged at below, otherwise we get id cast error
    var { id } = req.params;
    var campground = await Campground.findById(id).populate('reviews');
    var title = campground.city;
    var reviews = campground.reviews;
    res.render('campgrounds/show', { campground, id, title, reviews });
    //next(new AppError(404, 'No campground was found'));
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    var { id } = req.params;
    var editCampground = await Campground.findById(id);
    var title = editCampground.city;
    res.render('campgrounds/edit', { editCampground, title });
    //next(new AppError(500, 'Something went wrong :/')); //passing error to the ejs 
}));

app.patch('/campgrounds/:id', catchAsync(async (req, res) => { //UPDATE - PATCH
    var { id } = req.params;
    // var { name, price, category } = req.body;
    await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${id}`);
    //return next(new AppError(400, 'Fill in the requested areas')); //passing error to the ejs 
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    var { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
    //next(new AppError(500, 'Something went wrong :/'));
}));

app.get('/admin', (req, res) => { // an example of throwing 403 'forbidden' error
    throw new AppError(403, 'No permission!');
}) */



//app.js requirements
//const { object } = require('webidl-conversions');
//const morgan = require('morgan');
//const AppError = require('./appError');
//const Campground = require('./models/campground');
//const Review = require('./models/review');
//const ExpressError = require('./utils/ExpressError');
//const joi = require('joi');
//const catchAsync = require('./utils/catchAsync');
//const { privateDecrypt } = require('crypto');
//const { campgroundSchema, reviewSchema } = require('./validSchema');



// campground router stack
//router.get('/', catchAsync(campgroundController.index));

//router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundController.newCampgroundPost));

//router.get('/:id', catchAsync(campgroundController.showCampground));

//router.patch('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampgroundPatch));

//router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));


//user router stack
/* const methodOverride = require('method-override');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError'); */