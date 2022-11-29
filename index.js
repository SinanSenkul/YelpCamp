const express = require('express');
const app = express();
const campgroundRoutes = require('./routes/campgrounds');
const router = express.Router();

/* router.use((req, res, next) => {
        if (req.query.isAdmin) {
            next();
        }
        res.send('Sorry Not An Admin');
    }) */

app.use('/campgrounds', campgroundRoutes);

app.listen(3000, () => {
    console.log('Listening on localhost: 3000');
})