var express = require('express');
var router = require('./routes/index.js')
var path = require('path');
var app = express();
// TODO: add mongoDB info

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

module.exports=app;