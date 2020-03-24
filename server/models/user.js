const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const macrosSchema = new Schema({
  prots: {type: Number, require: true},
  carbs: {type: Number, require: true},
  fats: {type: Number, require: true}
});

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  macros: { type: macrosSchema, require: false },
  loggedIn: { type: Boolean, require: true}
}, { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);