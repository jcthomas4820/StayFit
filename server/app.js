const express = require('express');
const router = require('./routes/index.js');
const cors = require('cors');
const app = express();
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

app.set('trust proxy', 1);

// Set up cors. See SOURCES.md
const config = {
  origin: 'http://localhost:3000',
  credentials: true,
}
app.use(cors(config));

let dbURI;

console.log(process.env.MONGODB_HOST);

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    /* only log http requests when not testing */
    app.use(logger('dev'));

    // set the dbURI to the actual database
    dbURI = require('./config/keys.js').MONGO_URI;
    console.log("Connecting to actual database...");
} else {
    // connect to the test database
    dbURI = require('./config/keys.js').MONGO_URI_TEST;
    console.log("Connecting to test database...");
}

//// Complete the database connection
//mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true } );
//mongoose.connection
//  .once('open', _ => { console.log('Database connected!') })
//  .on('error', err => { console.error('Connection error: ', err) });
///
const promiseRetry = require('promise-retry')

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect(dbURI, options).then(()=>{
    console.log('MongoDB is connected')
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()
///

// Set up sessions 
// https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5
var sess = {
    secret: require('./config/keys.js').SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true },  // only using HTTP, add sameSite to protect against CSRF attacks
    store: new MongoStore( {mongooseConnection: mongoose.connection, collection: 'session'} )
  }
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup the router 
app.use('/api', router);

module.exports=app;