const User = require('../models/user');

module.exports.newUserGet = async (req, res) => {
    var title = "New User";
    res.render('users/register', { title });
}

module.exports.newUserPost = async (req, res, next) => {
    try {
        const { username, password, email } = req.body.user;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(user, function (err) {
            if (err) return next(err);
            return res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginGet = async (req, res) => {
    var title = "User Log In";
    res.render('users/login', { title });
}

module.exports.loginPost = async (req, res) => {
    req.flash('success', `Successfully logged in as ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}

module.exports.logoutGet = async (req, res) => {
    req.logout(function () {
        req.flash('success', 'You successfully logged out');
        res.redirect('/campgrounds');
    });
}