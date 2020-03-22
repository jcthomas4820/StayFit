const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const macrosSchema = new Schema({
  prots: {type: typeof(2.33333333), require: true},
  carbs: {type: typeof(2.33333333), require: true},
  fats: {type: typeof(2.33333333), require: true}
});

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  macros: { type: macrosSchema, require: false }
}, { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);