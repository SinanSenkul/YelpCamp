const Campground = require("./models/campground");

module.exports = async function isAuthor(req, res, next) {
    var { id } = req.params;
    var campground = await Campground.findById(id);
    console.log(campground.author);
    console.log(req.user._id);
    if (campground.author.equals(req.user._id)) {
        return next();
    }
    req.flash('error', 'You are not permitted');
    return res.redirect(`/campgrounds/${id}`);
}