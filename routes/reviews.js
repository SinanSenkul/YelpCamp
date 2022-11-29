const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../validSchema');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/reviewController');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;