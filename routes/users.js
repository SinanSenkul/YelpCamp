const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const userController = require('../controllers/userController');

router.route('/register')
    .get(catchAsync(userController.newUserGet))
    .post(catchAsync(userController.newUserPost));

router.route('/login')
    .get(catchAsync(userController.loginGet))
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), 
        userController.loginPost
        );

router.get('/logout', userController.logoutGet);

module.exports = router;