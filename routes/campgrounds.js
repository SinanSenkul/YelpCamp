const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const User = require('../models/user');
const { campgroundSchema } = require('../validSchema');
const ExpressError = require('../utils/ExpressError');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const campgroundController = require('../controllers/campgroundController');
const multer = require('multer');
const { storage } = require('../cloudinary');

const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgroundController.newCampgroundPost));

router.get('/new', isLoggedIn, campgroundController.newCampgroundGet);

router.route('/:id') // routes using :id have to be put below the routes which dont use it.
    .get(catchAsync(campgroundController.showCampground))
    .patch(isLoggedIn, isAuthor, upload.array('campground[image]'), catchAsync(campgroundController.editCampgroundPatch))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampgroundGet));

module.exports = router;

//upload.array('campground[image]')
/* .post(upload.array('campground[image]'), (req, res) => {
    console.log(req.body, req.files);
    res.send("new campground kinda created");
}) */