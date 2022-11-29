const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
    var { id } = req.params;
    var review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    var campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await campground.save();
    req.flash('success', 'New Review Successfully Added');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    var { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'New Review Successfully Deleted');
    res.redirect(`/campgrounds/${id}`);
}
