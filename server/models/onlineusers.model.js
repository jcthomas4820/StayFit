const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
}, {
  timestamps: true,
});

const OnlineUser = mongoose.model('User', userSchema);

module.exports = OnlineUser;