const mongoose = require('mongoose');

const { Schema } = mongoose;

/* 
meals[i] = {id, title, image, imageUrls, readyInMinutes, servings}
mealplan_nurtients = [cal, carbs, fat, protein]
*/

const recSchema = new Schema(
  {
    username: { type: String, require: true },
    cal_rec: { type: Number, require: true },
    meals: { type: Array, require: false },
    mealplan_nutrients: { type: Array, require: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Rec', recSchema);
