const Campground = require("./models/campground");
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./validSchema');
const ExpressError = require('./utils/ExpressError');

module.exports.validateCampground = (req, res, next) => {
    var { error } = campgroundSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You have to log in first.');
    req.session.returnTo = req.originalUrl.slice(0, 37); //gives error in review routes so i slice the campground show route
    //console.log('isloggedin says: returnto address: ' + req.session.returnTo);
    res.redirect('/login');
}

module.exports.isAuthor = async (req, res, next) => {
    var { id } = req.params;
    var campground = await Campground.findById(id);
    /* console.log(campground.author);
    console.log(req.user._id); */
    if (campground.author.equals(req.user._id)) {
        return next();
    }
    req.flash('error', 'You are not permitted to make changes on this campground');
    return res.redirect(`/campgrounds/${id}`);
}

module.exports.isReviewAuthor = async (req, res, next) => {
    var { id, reviewId } = req.params;
    var review = await Review.findById(reviewId);
    if (review.author.equals(req.user._id)) {
        return next();
    }
    req.flash('error', 'You are not permitted to make changes on this review');
    return res.redirect(`/campgrounds/${id}`);
}

module.exports.validateReview = (req, res, next) => {
    var { error } = reviewSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

