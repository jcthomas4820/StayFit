const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: { type: String, require: true},
    progress: { type: String, require: true},
    date: {type: String, require: true}
});

const gridSchema = new Schema({
  username: { type: String, require: true, unique: true},
  exercise1: { type: exerciseSchema, require: false},
  exercise2: { type: exerciseSchema, require: false},
  exercise3: { type: exerciseSchema, require: false}
}

);

module.exports = mongoose.model('Grid', gridSchema);