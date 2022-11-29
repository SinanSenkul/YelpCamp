module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You have to log in first.');
    req.session.returnTo = req.originalUrl.slice(0, 37); //gives error in review routes so i slice the campground show route
    res.redirect('/login');
}

/* console.log('isloggedin says: returnto address: ' + req.session.returnTo); */