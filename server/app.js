const express = require('express');
const router = require('./routes/index.js');
const path = require('path');
const cors = require('cors');
const app = express();
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// Set up mongoDB
const dbURI = require('./config/keys.js').MONGO_URI_USER;
mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true } );
const db = mongoose.connection;
db.once('open', _ => { console.log('Database connected') });
db.on('error', err => { console.error('connection error: ', err) });

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    /* only log http requests when not testing */
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up sessions 
// https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5
var sess = {
    secret: require('./config/keys.js').SESSION_SECRET,
    cookie: {},
    // store: new MongoStore({mongooseConnection: db})
  }
app.use(session(sess));

// Enable cors and set up the router 
app.use(cors());
app.use('/api', router);

module.exports=app;