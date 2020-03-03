const express = require('express');
const router = require('./routes/index.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const session = require('express-session');

const dbRoute = 'mongodb+srv://seniorsquadAdmin:vPnQLx1Hh0peXdf9@cs494-finalproject-ykt61.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbRoute, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true); // deprecation issue: https://github.com/Automattic/mongoose/issues/6890

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    /* only log http requests when not testing */
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var sess = {
    secret: 'ThisIsMySecret',
    cookie: {}
  }
  app.use(session(sess));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

module.exports=app;