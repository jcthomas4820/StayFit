const express = require('express');
const cors = require('cors');

const app = express();
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const router = require('./routes/index.js');
const gridRouter = require('./routes/grid_routes');
const calRouter = require('./routes/cal_routes');
const mealRouter = require('./routes/meal_routes');

app.set('trust proxy', 1);

require('dotenv').config();

// Set up cors. See SOURCES.md
const config = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(config));

let dbURI;

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  /* only log http requests when not testing */
  app.use(logger('dev'));

  // set the dbURI to the actual database
  dbURI = process.env.MONGO_URI;
  console.log('Connecting to actual database...');
} else {
  // connect to the test database
  dbURI = process.env.MONGO_URI_TEST;
  console.log('Connecting to test database...');
}

// Complete the database connection
mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connection
  .once('open', (_) => {
    console.log('Database connected!');
  })
  .on('error', (err) => {
    console.error('Connection error: ', err);
  });

// Set up sessions
// https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5
const sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: true }, // only using HTTP, add sameSite to protect against CSRF attacks
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session',
  }),
};
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup the router
app.use('/api', router);

app.use('/grid', gridRouter);
app.use('/cal', calRouter);
app.use('/meal', mealRouter);

module.exports = app;
