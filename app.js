const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const chalk = require('chalk');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override')

//mongostore must be below session
let MongoStore = require('connect-mongo')(session);

require('dotenv').config();
require('./lib/passport'); // need this to use passport

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/users/userRouter');
const movieRouter = require('./routes/movies/movieRouter');

const app = express();

//! Connect DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log(chalk.cyan('MongoDB Connected'));
    })
    .catch(err => console.log(`MongoDB error ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//create session middleware
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        //required
        secret: process.env.SESSION_SECRET,
        //store info in DB
        store: new MongoStore({
            url: process.env.MONGO_URI,
            autoReconnect: true
        }),
        cookie: {
            secure: false,
            maxAge: 60000
        }
    })
);

// initialize passport module
app.use(passport.initialize());
// create session, this must be below session middleware
app.use(passport.session());

//locals allow us to create variables to use throughout the app
app.use((req, res, next) => {
    //passport gives us the use of req.user which we define as user
    res.locals.user = req.user;
    next();
});

//Router middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', movieRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
