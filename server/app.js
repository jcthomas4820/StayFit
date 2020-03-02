const express = require('express');
const router = require('./routes/index.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

const dbRoute = 'mongodb+srv://seniorsquadAdmin:vPnQLx1Hh0peXdf9@cs494-finalproject-ykt61.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbRoute);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

module.exports=app;