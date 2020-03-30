const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    username: {type: String, require: true},
    exerciseNumber: {type: Number, require: true},
    name: {type: String, require: true},
    progress: {type: String, require: true},
    date: {type: String, require: true}
}, {
   timestamps: true,
 });
module.exports = mongoose.model('Exercise', exerciseSchema);
