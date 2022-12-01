if (process.env.NODE_ENV !== "production"){ //not production: website is under development.
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const app = express();
const User = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const localURL = process.env.LOCAL_URL;
const dbURL = process.env.DB_URL || localURL; //mongo atlas db url
const MongoStore = require('connect-mongo');

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    //useCreateIndex: true, //mongodb says no more supported
    useUnifiedTopology: true,
    //useFindAndModify: false //mongoose version seems not supporting this
}) //you have to run this file on your git terminal
    .then(() => {
        console.log("mongoose connection opened");
    })
    .catch((err) => {
        console.log("error:" + err);
    })

const db = mongoose.connection;
/* db.on("error", console.log('DB ERROR')); */
db.once("open", () => {
    console.log("db connected");
})

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //this code enables to parse req.body
app.use(methodOverride('_method')); // enables editing
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    mongoSanitize({
      allowDots: true,
      replaceWith: '_',
    }),
);

const secret = process.env.SECRET || 'sessionsecret';

var store = MongoStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 * 60 * 60, //seconds
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
});

const sessionConfig = { //default store is the memory store.
    name: 'yelpsession',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7, //milliseconds
        httpOnly: true,
        //secure: true //commented out before deploying
    },
    store: store
}
app.use(session(sessionConfig));
app.use(flash());

//app.use(helmet());
const scriptSrcUrl = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"

];
const styleSrcUrl = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
];
const connectSrcUrl = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrl = [];
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrl],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrl],
        styleSrc: ["'unsafe-inline'", "'self'", ...styleSrcUrl],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
                    "'self'", "blob:", "data:", 
                    "https://res.cloudinary.com/dl5ogyp0c/", 
                    "https://images.unsplash.com/"
                ],
        fontSrc: ["'self'", ...fontSrcUrl]
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {  //locals are data that every template can access. must be written BELOW serialize/deserializers as they are responsible of saving data to req.user 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//ROUTE HANDLERS
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/review', reviewRoutes);
app.use('/', userRoutes);

app.use((req, res) => { // 404 error handler
    var title = 'Error 404';
    var status = '404';
    res.status(404).render('error', { title, status });
})

app.use((err, req, res, next) => { //error handlers are written last in app.use order
    const { status = 500, message = 'Something went wrong' } = err;
    var title = `Error ${status}`;
    res.status(status).render('error', { title, status, err });
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Yelpcamp server listening');
})