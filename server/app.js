const express = require('express');
const router = require('./routes/index.js');
const path = require('path');
const cors = require('cors');
const app = express();
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');

// Set up mongoDB
const dbRoute = require('./config/keys.js').mongodb_uri
mongoose.connect(dbRoute, {useNewUrlParser: true});

// Check the connection
let db = mongoose.connection;
db.once('open', () => console.log('MongoDB successfully connected!'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    /* only log http requests when not testing */
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up sessions 
var sess = {
    secret: 'ThisIsMySecret',
    cookie: {}
  }
  app.use(session(sess));

// Enable cors and set up the router 
app.use(cors());
app.use('/api', router);

module.exports=app;